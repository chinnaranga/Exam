import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export interface LocalAutosaveRecord {
  index: number;
  sessionId: string;
  prevHash: string;
  seq: number;
  questionId: string;
  answer: unknown;
  timestamp: number;
  hash: string;
}

export interface UseHashChainedAutosaveOptions {
  sessionId: string;
  sessionSecretKeyHex?: string;
  autoSyncIntervalMs?: number;
  onChainTamperDetected?: (details: { index?: number; error?: string }) => void;
}

const DB_NAME = 'AssessIQ_Autosave_DB';
const DB_VERSION = 1;
const STORE_NAME = 'answers_chain';

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function useHashChainedAutosave({
  sessionId,
  sessionSecretKeyHex = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  autoSyncIntervalMs = 15000,
  onChainTamperDetected,
}: UseHashChainedAutosaveOptions) {
  const [isReady, setIsReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [recordsCount, setRecordsCount] = useState<number>(0);

  const dbRef = useRef<IDBDatabase | null>(null);
  const cryptoKeyRef = useRef<CryptoKey | null>(null);
  const lastRecordRef = useRef<LocalAutosaveRecord | null>(null);
  const seqRef = useRef<number>(0);

  // 1. Initialize Non-Extractable WebCrypto HMAC Key
  const initWebCryptoKey = useCallback(async () => {
    try {
      const rawBytes = hexToBytes(sessionSecretKeyHex);
      // Non-extractable key (extractable: false)
      const importedKey = await window.crypto.subtle.importKey(
        'raw',
        rawBytes,
        { name: 'HMAC', hash: 'SHA-256' },
        false, // Cannot be extracted via exportKey by malicious scripts/DevTools
        ['sign']
      );
      cryptoKeyRef.current = importedKey;
    } catch (err) {
      console.warn('Failed to import non-extractable WebCrypto key:', err);
    }
  }, [sessionSecretKeyHex]);

  // 2. Initialize IndexedDB
  const initIndexedDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'index' });
          store.createIndex('sessionId', 'sessionId', { unique: false });
          store.createIndex('questionId', 'questionId', { unique: false });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        dbRef.current = db;
        resolve(db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }, []);

  // Compute HMAC over canonical payload
  const computeRecordHmac = async (
    seq: number,
    prevHash: string,
    questionId: string,
    answer: unknown,
    timestamp: number
  ): Promise<string> => {
    if (!cryptoKeyRef.current) {
      throw new Error('WebCrypto non-extractable key not initialized');
    }

    const canonicalPayload = JSON.stringify({
      seq,
      prevHash,
      questionId,
      answer,
      timestamp,
    });

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(canonicalPayload);

    const signature = await window.crypto.subtle.sign('HMAC', cryptoKeyRef.current, dataBuffer);
    return bytesToHex(new Uint8Array(signature));
  };

  // Load latest record from DB to resume chain
  const loadLastRecord = useCallback(async (db: IDBDatabase): Promise<LocalAutosaveRecord | null> => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.openCursor(null, 'prev'); // Open cursor from end

      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          const record = cursor.value as LocalAutosaveRecord;
          if (record.sessionId === sessionId) {
            resolve(record);
            return;
          }
          cursor.continue();
        } else {
          resolve(null);
        }
      };

      req.onerror = () => reject(req.error);
    });
  }, [sessionId]);

  // Setup DB & Key on mount
  useEffect(() => {
    let mounted = true;

    async function setup() {
      try {
        await initWebCryptoKey();
        const db = await initIndexedDB();
        const lastRecord = await loadLastRecord(db);

        if (mounted) {
          lastRecordRef.current = lastRecord;
          seqRef.current = lastRecord ? lastRecord.seq : 0;
          setRecordsCount(lastRecord ? lastRecord.index + 1 : 0);
          setIsReady(true);
        }
      } catch (err) {
        console.error('Autosave setup failure:', err);
      }
    }

    setup();

    return () => {
      mounted = false;
      if (dbRef.current) {
        dbRef.current.close();
      }
    };
  }, [initWebCryptoKey, initIndexedDB, loadLastRecord]);

  // Append new answer to the hash chain in IndexedDB
  const saveAnswer = useCallback(
    async (questionId: string, answer: unknown): Promise<LocalAutosaveRecord> => {
      if (!dbRef.current || !cryptoKeyRef.current) {
        throw new Error('Hash-chained autosave engine not ready');
      }

      const prev = lastRecordRef.current;
      const prevHash = prev ? prev.hash : '0'.repeat(64);
      const nextIndex = prev ? prev.index + 1 : 0;
      const nextSeq = seqRef.current + 1;
      const timestamp = Date.now();

      const hash = await computeRecordHmac(nextSeq, prevHash, questionId, answer, timestamp);

      const record: LocalAutosaveRecord = {
        index: nextIndex,
        sessionId,
        prevHash,
        seq: nextSeq,
        questionId,
        answer,
        timestamp,
        hash,
      };

      // Store in IndexedDB
      await new Promise<void>((resolve, reject) => {
        if (!dbRef.current) return reject(new Error('No DB'));
        const tx = dbRef.current.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(record);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });

      lastRecordRef.current = record;
      seqRef.current = nextSeq;
      setRecordsCount(nextIndex + 1);

      return record;
    },
    [sessionId]
  );

  // Retrieve all records for this session from IndexedDB
  const getAllSessionRecords = useCallback(async (): Promise<LocalAutosaveRecord[]> => {
    if (!dbRef.current) return [];

    return new Promise((resolve, reject) => {
      const tx = dbRef.current!.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const all = req.result as LocalAutosaveRecord[];
        const filtered = all.filter((r) => r.sessionId === sessionId).sort((a, b) => a.index - b.index);
        resolve(filtered);
      };
      req.onerror = () => reject(req.error);
    });
  }, [sessionId]);

  // Sync hash chain with server
  const syncChainWithServer = useCallback(async (): Promise<{ success: boolean; valid: boolean }> => {
    if (isSyncing) return { success: false, valid: false };
    setIsSyncing(true);

    try {
      const records = await getAllSessionRecords();
      if (records.length === 0) {
        setIsSyncing(false);
        return { success: true, valid: true };
      }

      const res = await fetch(`/api/v1/session/${sessionId}/autosave/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records }),
      });

      if (res.ok) {
        const data = await res.json();
        setLastSyncTime(Date.now());

        if (!data.valid) {
          if (onChainTamperDetected) {
            onChainTamperDetected({
              index: data.brokenAtIndex,
              error: data.error,
            });
          }
          return { success: true, valid: false };
        }

        return { success: true, valid: true };
      }

      return { success: false, valid: false };
    } catch {
      return { success: false, valid: false };
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, getAllSessionRecords, sessionId, onChainTamperDetected]);

  // Periodic auto-sync
  useEffect(() => {
    if (!isReady || autoSyncIntervalMs <= 0) return;

    const timer = setInterval(() => {
      if (navigator.onLine) {
        syncChainWithServer().catch(() => {});
      }
    }, autoSyncIntervalMs);

    return () => clearInterval(timer);
  }, [isReady, autoSyncIntervalMs, syncChainWithServer]);

  return {
    isReady,
    isSyncing,
    lastSyncTime,
    recordsCount,
    saveAnswer,
    syncChainWithServer,
    getAllSessionRecords,
  };
}

export default useHashChainedAutosave;
