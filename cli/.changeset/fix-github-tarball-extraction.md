---
"@craftreactnative/ui": patch
---

Fix init failing: resolve GitHub tarball extraction path dynamically

GitHub tarballs unpack to a top-level directory (e.g. ui-main), and craftrn-ui lives at repo root, not under demo-app. The CLI now detects the extracted directory name and looks for craftrn-ui at the correct path.
