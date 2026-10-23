# Manual QA checklist (real devices)

Automated checks cover Chromium (Pixel 7 emulation), accessibility rules and Lighthouse (mobile: Performance 0.99, Accessibility 1.00, Best Practices 1.00 on 2026-10-23). These steps need a real device because WebKit is not run locally.

## iPhone (Safari), after the first deploy

1. Open the deployed URL in Safari. The home screen shows four modes and "0 due now".
2. Practice: run a 10-question session on one domain; answer one wrongly and flag one "Not sure". Check the explanation, the "why the other options are wrong" list and the references open in a new tab.
3. Exam: start an exam, answer a few questions, leave one open until the timer is visibly counting; finish and read the per-domain table.
4. Scenarios: open one, read the narrative and evidence, run it, answer the open question with the self-assessment buttons, read the debrief.
5. Share > Add to Home Screen. Launch from the icon: it opens full screen without Safari bars and the notch/home indicator do not cover content.
6. Turn on airplane mode, force-quit and relaunch the app: the home screen, Practice and a full run still work.
7. Turn airplane mode off. Review: the missed and flagged questions appear (the missed one becomes due the next day).
8. Settings: switch language to Romanian and back, switch to Dark, set text size to Extra large; check no text is cut off or overlaps.
9. Settings: export progress (a JSON file is offered to Save/Share), reset, then import the same file: the Stats page returns to what it was.
10. Rotate to landscape on a question page: nothing overflows horizontally.

## Android

Android Chrome is only emulated in Playwright (Pixel 7). Real-device testing has not been done; repeat the steps above on a real Android phone when one is available and install via "Install app".

## Notes to record

- Anything that differs between iOS Safari and Chromium (installation prompt, offline relaunch, file export).
- Any layout issue under the notch or the home indicator.
