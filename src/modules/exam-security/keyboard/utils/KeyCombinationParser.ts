export interface ParsedKeyCombination {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  mainKey: string;
}

export class KeyCombinationParser {
  public static parseString(combination: string): ParsedKeyCombination {
    const parts = combination.split('+').map((p) => p.trim());
    let ctrl = false;
    let shift = false;
    let alt = false;
    let meta = false;
    let mainKey = '';

    parts.forEach((part) => {
      const lower = part.toLowerCase();
      if (lower === 'ctrl' || lower === 'control') ctrl = true;
      else if (lower === 'shift') shift = true;
      else if (lower === 'alt') alt = true;
      else if (lower === 'meta' || lower === 'cmd' || lower === 'win') meta = true;
      else mainKey = part.toUpperCase();
    });

    return { ctrl, shift, alt, meta, mainKey };
  }

  public static parseEvent(event: KeyboardEvent): ParsedKeyCombination {
    return {
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey,
      mainKey: event.key.length === 1 ? event.key.toUpperCase() : event.key.toUpperCase(),
    };
  }

  public static formatToString(parsed: ParsedKeyCombination): string {
    const parts: string[] = [];
    if (parsed.ctrl) parts.push('Ctrl');
    if (parsed.shift) parts.push('Shift');
    if (parsed.alt) parts.push('Alt');
    if (parsed.meta) parts.push('Meta');
    if (parsed.mainKey) parts.push(parsed.mainKey);
    return parts.join('+');
  }
}
