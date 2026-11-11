import { BrowserIntegrityEngine } from '../core/BrowserIntegrityEngine';
import { IntegrityEvent, IntegritySeverity } from '../types/IntegrityEvent';

/**
 * @class DashboardUI
 * @description High-density dark enterprise UI dashboard for real-time visualization of browser integrity telemetry, signal confidence ratings, and JSON payload exporting.
 */
export class DashboardUI {
  private containerElement: HTMLElement | null = null;
  private unsubscribe?: () => void;
  private selectedSeverityFilter: string = 'ALL';
  private searchQuery: string = '';

  constructor(private engine: BrowserIntegrityEngine, targetElementId?: string) {
    if (typeof document !== 'undefined') {
      if (targetElementId) {
        this.containerElement = document.getElementById(targetElementId);
      }
    }
  }

  /**
   * Mount and render the Dashboard UI into target container or document body.
   */
  public mount(container?: HTMLElement): void {
    if (typeof document === 'undefined') return;
    this.containerElement = container || this.containerElement || document.body;

    this.renderShell();
    this.attachSubscriptions();
    this.update();
  }

  private attachSubscriptions(): void {
    this.unsubscribe = this.engine.eventBus.subscribe('*', () => {
      this.update();
    });
  }

  private renderShell(): void {
    if (!this.containerElement) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'assessiq_integrity_dashboard';
    wrapper.className = 'w-full bg-[#0B0F19] text-[#F8FAFC] p-6 font-sans rounded-2xl border border-[#1E293B] shadow-2xl space-y-6 select-none';

    wrapper.innerHTML = `
      <!-- Top Header & Controls -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-lg font-mono font-bold tracking-wider uppercase text-white">Browser Integrity Telemetry SDK</h2>
            <span className="text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">v1.0.0</span>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">Client-side signal telemetry stream • Final scoring evaluated server-side</p>
        </div>

        <div className="flex items-center space-x-3">
          <button id="btn_export_json" className="bg-[#1E293B] hover:bg-[#334155] text-white font-mono font-bold text-xs px-4 py-2 rounded-xl border border-[#334155] transition-all cursor-pointer">
            📥 Export JSON Payload
          </button>
        </div>
      </div>

      <!-- Live Summary Bar -->
      <div id="integrity_summary_bar" className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs"></div>

      <!-- Filter Toolbar -->
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111827] p-3 rounded-xl border border-[#1E293B]">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-mono text-[#94A3B8] font-bold">Severity:</span>
          <select id="select_severity_filter" className="bg-[#1E293B] text-white border border-[#334155] text-xs font-mono rounded-lg px-2.5 py-1">
            <option value="ALL">ALL SEVERITIES</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
            <option value="INFO">INFO</option>
          </select>
        </div>

        <div className="w-full sm:w-64">
          <input id="input_search_query" type="text" placeholder="Search signals or modules..." className="w-full bg-[#1E293B] border border-[#334155] text-xs text-white px-3 py-1.5 rounded-lg placeholder-[#64748B] focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      <!-- Live Signal Timeline Stream -->
      <div className="space-y-2">
        <h3 className="text-xs font-mono uppercase font-bold text-[#94A3B8] tracking-wider">Live Integrity Signal Stream</h3>
        <div id="integrity_event_stream" className="max-h-96 overflow-y-auto space-y-2.5 pr-2 font-sans text-xs"></div>
      </div>
    `;

    this.containerElement.appendChild(wrapper);

    // Event Listeners for controls
    const exportBtn = wrapper.querySelector('#btn_export_json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.handleExport());
    }

    const filterSelect = wrapper.querySelector('#select_severity_filter') as HTMLSelectElement;
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.selectedSeverityFilter = (e.target as HTMLSelectElement).value;
        this.update();
      });
    }

    const searchInput = wrapper.querySelector('#input_search_query') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        this.update();
      });
    }
  }

  /**
   * Update the UI DOM elements with latest telemetry buffer.
   */
  public update(): void {
    if (typeof document === 'undefined') return;
    const wrapper = document.getElementById('assessiq_integrity_dashboard');
    if (!wrapper) return;

    const summary = this.engine.telemetryManager.getSummary();
    const summaryBar = wrapper.querySelector('#integrity_summary_bar');

    if (summaryBar) {
      summaryBar.innerHTML = `
        <div className="bg-[#111827] p-3 rounded-xl border border-[#1E293B]">
          <span className="text-[#94A3B8]">Duration</span>
          <div className="text-base font-bold text-white">${summary.sessionDurationSeconds}s</div>
        </div>
        <div className="bg-[#111827] p-3 rounded-xl border border-[#1E293B]">
          <span className="text-[#94A3B8]">Total Signals</span>
          <div className="text-base font-bold text-blue-400">${summary.totalEvents}</div>
        </div>
        <div className="bg-[#111827] p-3 rounded-xl border border-red-900/50">
          <span className="text-red-400">Critical</span>
          <div className="text-base font-bold text-red-400">${summary.eventsBySeverity.CRITICAL || 0}</div>
        </div>
        <div className="bg-[#111827] p-3 rounded-xl border border-amber-900/50">
          <span className="text-amber-400">High</span>
          <div className="text-base font-bold text-amber-400">${summary.eventsBySeverity.HIGH || 0}</div>
        </div>
        <div className="bg-[#111827] p-3 rounded-xl border border-yellow-900/50">
          <span className="text-yellow-400">Medium</span>
          <div className="text-base font-bold text-yellow-400">${summary.eventsBySeverity.MEDIUM || 0}</div>
        </div>
        <div className="bg-[#111827] p-3 rounded-xl border border-slate-800">
          <span className="text-[#94A3B8]">Low / Info</span>
          <div className="text-base font-bold text-emerald-400">${(summary.eventsBySeverity.LOW || 0) + (summary.eventsBySeverity.INFO || 0)}</div>
        </div>
      `;
    }

    const eventStream = wrapper.querySelector('#integrity_event_stream');
    if (eventStream) {
      const filtered = this.engine.telemetryManager.getFilteredEvents({
        severities: this.selectedSeverityFilter === 'ALL' ? undefined : [this.selectedSeverityFilter as IntegritySeverity],
        searchQuery: this.searchQuery,
      });

      if (filtered.length === 0) {
        eventStream.innerHTML = `
          <div className="p-8 text-center text-[#64748B] font-mono bg-[#111827] rounded-xl border border-[#1E293B]">
            No telemetry signals recorded matching current filter.
          </div>
        `;
      } else {
        eventStream.innerHTML = filtered.slice().reverse().slice(0, 100).map((evt) => this.renderEventCard(evt)).join('');
      }
    }
  }

  private renderEventCard(evt: IntegrityEvent): string {
    const sevColor =
      evt.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-800' :
      evt.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border-amber-800' :
      evt.severity === 'MEDIUM' ? 'bg-yellow-950 text-yellow-400 border-yellow-800' :
      evt.severity === 'LOW' ? 'bg-blue-950 text-blue-400 border-blue-800' :
      'bg-slate-900 text-slate-400 border-slate-700';

    const confColor =
      evt.confidence === 'HIGH' ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800' :
      evt.confidence === 'MEDIUM' ? 'text-yellow-400 bg-yellow-950/60 border-yellow-800' :
      'text-slate-400 bg-slate-900 border-slate-700';

    const timeStr = new Date(evt.timestampMs).toLocaleTimeString();

    return `
      <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] text-[#94A3B8] font-bold">${timeStr}</span>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${sevColor}">
              ${evt.severity}
            </span>
            <span className="font-mono text-[10px] font-bold text-white bg-[#1E293B] px-2 py-0.5 rounded border border-[#334155]">
              ${evt.module} :: ${evt.type}
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${confColor}">
            Confidence: ${evt.confidence}
          </span>
        </div>

        <p className="text-xs font-semibold text-white">${evt.details.message}</p>
        <p className="text-[11px] text-[#94A3B8] italic font-mono">${evt.details.explanation}</p>

        ${evt.details.limitationNote ? `
          <div className="mt-1 p-2 rounded bg-amber-950/30 border border-amber-900/40 text-[10px] text-amber-300/90 font-mono">
            <strong>⚠️ Limitation:</strong> ${evt.details.limitationNote}
          </div>
        ` : ''}
      </div>
    `;
  }

  private handleExport(): void {
    const payload = this.engine.telemetryManager.exportJSONPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessiq_integrity_telemetry_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  public unmount(): void {
    if (this.unsubscribe) this.unsubscribe();
    const wrapper = document.getElementById('assessiq_integrity_dashboard');
    if (wrapper) wrapper.remove();
  }
}
