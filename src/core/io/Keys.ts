export function keyCodeToName(keyCode: KeyCode) {
  if (keyCode.startsWith("Key")) {
    return keyCode.substring("Key".length);
  } else if (keyCode.startsWith("Digit")) {
    return keyCode.substring("Digit".length);
  } else {
    return keyCode;
  }
}

/**
 * Possible values for `KeyboardEvent.code
 *
 * Taken from https://www.w3.org/TR/uievents-code/#code-value-tables
 */
export type KeyCode =
  // List of code values for writing system keys in the Alphanumeric section.
  | "Backquote" //	`~ on a US keyboard. This is the 半角/全角/漢字 (hankaku/zenkaku/kanji) key on Japanese keyboards
  | "Backslash" //Used for both the US \| (on the 101-key layout) and also for the key located between the " and Enter keys on row C of the 102-, 104- | and  //106-key layouts. Labelled #~ on a UK (102) keyboard.
  | "Backspace" //	Backspace or ⌫. Labelled Delete on Apple keyboards.
  | "BracketLeft" //	[{ on a US keyboard.
  | "BracketRight" //	]} on a US keyboard.
  | "Comma" //	,< on a US keyboard.
  | "Digit0" //	0) on a US keyboard.
  | "Digit1" //	1! on a US keyboard.
  | "Digit2" //	2@ on a US keyboard.
  | "Digit3" //	3# on a US keyboard.
  | "Digit4" //	4$ on a US keyboard.
  | "Digit5" //	5% on a US keyboard.
  | "Digit6" //	6^ on a US keyboard.
  | "Digit7" //	7& on a US keyboard.
  | "Digit8" //	8* on a US keyboard.
  | "Digit9" //	9( on a US keyboard.
  | "Equal" //	=+ on a US keyboard.
  | "IntlBackslash" //	Located between the left Shift and Z keys. Labelled \| on a UK keyboard.
  | "IntlRo" //	Located between the / and right Shift keys. Labelled \ろ (ro) on a Japanese keyboard.
  | "IntlYen" //	Located between the = and Backspace keys. Labelled ¥ (yen) on a Japanese keyboard. \/ on a Russian keyboard.
  | "KeyA" //	a on a US keyboard. Labelled q on an AZERTY (e.g., French) keyboard.
  | "KeyB" //	b on a US keyboard.
  | "KeyC" //	c on a US keyboard.
  | "KeyD" //	d on a US keyboard.
  | "KeyE" //	e on a US keyboard.
  | "KeyF" //	f on a US keyboard.
  | "KeyG" //	g on a US keyboard.
  | "KeyH" //	h on a US keyboard.
  | "KeyI" //	i on a US keyboard.
  | "KeyJ" //	j on a US keyboard.
  | "KeyK" //	k on a US keyboard.
  | "KeyL" //	l on a US keyboard.
  | "KeyM" //	m on a US keyboard.
  | "KeyN" //	n on a US keyboard.
  | "KeyO" //	o on a US keyboard.
  | "KeyP" //	p on a US keyboard.
  | "KeyQ" //	q on a US keyboard. Labelled a on an AZERTY (e.g., French) keyboard.
  | "KeyR" //	r on a US keyboard.
  | "KeyS" //	s on a US keyboard.
  | "KeyT" //	t on a US keyboard.
  | "KeyU" //	u on a US keyboard.
  | "KeyV" //	v on a US keyboard.
  | "KeyW" //	w on a US keyboard. Labelled z on an AZERTY (e.g., French) keyboard.
  | "KeyX" //	x on a US keyboard.
  | "KeyY" //	y on a US keyboard. Labelled z on a QWERTZ (e.g., German) keyboard.
  | "KeyZ" //	z on a US keyboard. Labelled w on an AZERTY (e.g., French) keyboard, and y on a QWERTZ (e.g., German) keyboard.
  | "Minus" //	-_ on a US keyboard.
  | "Period" //	.> on a US keyboard.
  | "Quote" //	'" on a US keyboard.
  | "Semicolon" //	;: on a US keyboard.
  | "Slash" //	/? on a US keyboard.
  // List of code values for functional keys in the Alphanumeric section
  | "AltLeft" //	Alt, Option or ⌥.
  | "AltRight" //	Alt, Option or ⌥. This is labelled AltGr key on many keyboard layouts.
  | "CapsLock" //	CapsLock or ⇪
  | "ContextMenu" //	The application context menu key, which is typically found between the right Meta key and the right Control key.
  | "ControlLeft" //	Control or ⌃
  | "ControlRight" //	Control or ⌃
  | "Enter" //	Enter or ↵. Labelled Return on Apple keyboards.
  | "MetaLeft" //	The Windows, ⌘, Command or other OS symbol key.
  | "MetaRight" //	The Windows, ⌘, Command or other OS symbol key.
  | "ShiftLeft" //	Shift or ⇧
  | "ShiftRight" //	Shift or ⇧
  | "Space" // 	  (space)
  | "Tab" // Tab or ⇥
  // List of code values for functional keys found on Japanese and Korean keyboards.
  | "Convert" //	Japanese: 変換 (henkan)
  | "KanaMode" //	Japanese: カタカナ/ひらがな/ローマ字 (katakana/hiragana/romaji)
  | "Lang1" //	Korean: HangulMode 한/영 (han/yeong). Japanese //(Mac keyboard): かな (kana)
  | "Lang2" //	Korean: Hanja 한자 (hanja). Japanese //(Mac keyboard): 英数 (eisu)
  | "Lang3" //	Japanese (word-processing keyboard): Katakana
  | "Lang4" //	Japanese (word-processing keyboard): Hiragana
  | "Lang5" //	Japanese (word-processing keyboard): Zenkaku/Hankaku
  | "NonConvert" // Japanese: 無変換 (muhenkan)
  // List of code values for keys in the ControlPad section.
  | "Delete" // ⌦. The forward delete key. Note that on Apple keyboards, the key labelled Delete on the main part of the keyboard should be encoded as "Backspace".
  | "End" // Page Down, End or ↘
  | "Help" // Help. Not present on standard PC keyboards.
  | "Home" // Home or ↖
  | "Insert" // Insert or Ins. Not present on Apple keyboards.
  | "PageDown" // Page Down, PgDn or ⇟
  | "PageUp" // Page Up, PgUp or ⇞
  // List of code values for keys in the ArrowPad section.
  | "ArrowDown" //	↓
  | "ArrowLeft" //	←
  | "ArrowRight" //	→
  | "ArrowUp" //	↑
  // List of code values for keys in the Numpad section.
  | "NumLock" // On the Mac, the "NumLock" code should be used for the numpad Clear key.
  | "Numpad0" // 0 Ins on a keyboard. 0 on a phone or remote control
  | "Numpad1" // 1 End on a keyboard. 1 or 1 QZ on a phone or remote control
  | "Numpad2" // 2 ↓ on a keyboard. 2 ABC on a phone or remote control
  | "Numpad3" // 3 PgDn on a keyboard. 3 DEF on a phone or remote control
  | "Numpad4" // 4 ← on a keyboard. 4 GHI on a phone or remote control
  | "Numpad5" // 5 on a keyboard. 5 JKL on a phone or remote control
  | "Numpad6" // 6 → on a keyboard. 6 MNO on a phone or remote control
  | "Numpad7" // 7 Home on a keyboard. 7 or 7 PRS on a phone or remote control
  | "Numpad8" // 8 ↑ on a keyboard. 8 TUV on a phone or remote control
  | "Numpad9" // 9 PgUp on a keyboard. 9 WXYZ or 9 WXY on a phone or remote control
  | "NumpadAdd" // +
  | "NumpadBackspace" // Found on the Microsoft Natural Keyboard.
  | "NumpadClear" // C or AC (All Clear). Also for use with numpads that have a Clear key that is separate from the NumLock key. On the Mac, the numpad Clear key should always be encoded as "NumLock".
  | "NumpadClearEntry" // CE (Clear Entry)
  | "NumpadComma" // , (thousands separator). For locales where the thousands separator is a "." (e.g., Brazil), this key may generate a ..
  | "NumpadDecimal" // . Del. For locales where the decimal separator is "," (e.g., Brazil), this key may generate a ,.
  | "NumpadDivide" // /
  | "NumpadEnter" //
  | "NumpadEqual" // =
  | "NumpadHash" // # on a phone or remote control device. This key is typically found below the 9 key and to the right of the 0 key.
  | "NumpadMemoryAdd" // M+ Add current entry to the value stored in memory.
  | "NumpadMemoryClear" // MC Clear the value stored in memory.
  | "NumpadMemoryRecall" // MR Replace the current entry with the value stored in memory.
  | "NumpadMemoryStore" // MS Replace the value stored in memory with the current entry.
  | "NumpadMemorySubtract" // M- Subtract current entry from the value stored in memory.
  | "NumpadMultiply" // * on a keyboard. For use with numpads that provide mathematical operations (+, -, * and /). Use "NumpadStar" // for the * key on phones and remote controls.
  | "NumpadParenLeft" // ( Found on the Microsoft Natural Keyboard.
  | "NumpadParenRight" // ) Found on the Microsoft Natural Keyboard.
  | "NumpadStar" // * on a phone or remote control device. This key is typically found below the 7 key and to the left of the 0 key. Use "NumpadMultiply" // for the * key on numeric keypads.
  | "NumpadSubtract" // -
  // List of code values for keys in the Function section.
  | "Escape" //	Esc or ⎋
  | "F1" //	F1
  | "F2" //	F2
  | "F3" //	F3
  | "F4" //	F4
  | "F5" //	F5
  | "F6" //	F6
  | "F7" //	F7
  | "F8" //	F8
  | "F9" //	F9
  | "F10" //	F10
  | "F11" //	F11
  | "F12" //	F12
  | "Fn" //	Fn This is typically a hardware key that does not generate a separate code. Most keyboards do not place this key in the function section, but it is included here to keep it with related keys.
  | "FnLock" //	FLock or FnLock. Function Lock key. Found on the Microsoft Natural Keyboard.
  | "PrintScreen" //	PrtScr SysRq or Print Screen
  | "ScrollLock" //	Scroll Lock
  | "Pause" //	Pause Break
  // List of code values for media keys.
  | "BrowserBack" //	Some laptops place this key to the left of the ↑ key.
  | "BrowserFavorites" //
  | "BrowserForward" //	Some laptops place this key to the right of the ↑ key.
  | "BrowserHome" //
  | "BrowserRefresh" //
  | "BrowserSearch" //
  | "BrowserStop" //
  | "Eject" //	Eject or ⏏. This key is placed in the function section on some Apple keyboards.
  | "LaunchApp1" //	Sometimes labelled My Computer on the keyboard
  | "LaunchApp2" //	Sometimes labelled Calculator on the keyboard
  | "LaunchMail" //
  | "MediaPlayPause" //
  | "MediaSelect" //
  | "MediaStop" //
  | "MediaTrackNext" //
  | "MediaTrackPrevious" //
  | "Power" //	This key is placed in the function section on some Apple keyboards, replacing the Eject key.
  | "Sleep" //
  | "AudioVolumeDown" //
  | "AudioVolumeMute" //
  | "AudioVolumeUp" //
  | "WakeUp" //
  // List of code values for legacy modifier keys.
  | "Hyper"
  | "Super"
  | "Turbo"
  // List of code values for legacy process control keys.
  | "Abort"
  | "Resume"
  | "Suspend"
  // List of code values for legacy editing keys.
  | "Again" //	Found on Sun’s USB keyboard.
  | "Copy" //	Found on Sun’s USB keyboard.
  | "Cut" //	Found on Sun’s USB keyboard.
  | "Find" //	Found on Sun’s USB keyboard.
  | "Open" //	Found on Sun’s USB keyboard.
  | "Paste" //	Found on Sun’s USB keyboard.
  | "Props" //	Found on Sun’s USB keyboard.
  | "Select" //	Found on Sun’s USB keyboard.
  | "Undo" //	Found on Sun’s USB keyboard.
  // List of code values for keys found on international keyboards.
  | "Hiragana" // Use for dedicated ひらがな key found on some Japanese word processing keyboards.
  | "Katakana" // Use for dedicated カタカナ key found on some Japanese word processing keyboards.
  // List of special code values.
  | "Unidentified"; // This value code should be used when no other value given in this specification is appropriate.
