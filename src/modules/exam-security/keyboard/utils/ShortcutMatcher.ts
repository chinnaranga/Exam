import { KeyCombinationParser } from './KeyCombinationParser';
import { KeyboardShortcutRule } from '../types/KeyboardShortcut';

export class ShortcutMatcher {
  public static matches(event: KeyboardEvent, rule: KeyboardShortcutRule): boolean {
    const eventParsed = KeyCombinationParser.parseEvent(event);
    const ruleParsed = KeyCombinationParser.parseString(rule.keyCombination);

    return (
      eventParsed.ctrl === ruleParsed.ctrl &&
      eventParsed.shift === ruleParsed.shift &&
      eventParsed.alt === ruleParsed.alt &&
      eventParsed.meta === ruleParsed.meta &&
      eventParsed.mainKey === ruleParsed.mainKey
    );
  }

  public static findMatchingRule(event: KeyboardEvent, rules: KeyboardShortcutRule[]): KeyboardShortcutRule | undefined {
    return rules.find((rule) => this.matches(event, rule));
  }
}
