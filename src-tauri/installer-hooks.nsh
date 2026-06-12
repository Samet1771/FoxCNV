; FoxCNV — NSIS installer hooks (Tauri v2)
;
; Registers the classic right-click "Convert with FoxCNV" verb. We write under
; HKCU\Software\Classes\SystemFileAssociations\.<ext>\shell so it works WITHOUT
; admin (matches the per-user `currentUser` install) and only appears on file
; types we actually handle — not on every file (no "*" bloat). The command
; launches the app with the clicked file's path as the first argument ("%1");
; single-instance handling then loads it into any running window.
;
; To support more types later, add the extension to BOTH lists below.

!macro RegFoxCNVVerb ext
  WriteRegStr HKCU "Software\Classes\SystemFileAssociations\.${ext}\shell\FoxCNV.Convert" "" "Convert with FoxCNV"
  WriteRegStr HKCU "Software\Classes\SystemFileAssociations\.${ext}\shell\FoxCNV.Convert" "Icon" "$INSTDIR\FoxCNV.exe,0"
  WriteRegStr HKCU "Software\Classes\SystemFileAssociations\.${ext}\shell\FoxCNV.Convert\command" "" '"$INSTDIR\FoxCNV.exe" "%1"'
!macroend

!macro UnregFoxCNVVerb ext
  DeleteRegKey HKCU "Software\Classes\SystemFileAssociations\.${ext}\shell\FoxCNV.Convert"
!macroend

!macro NSIS_HOOK_POSTINSTALL
  ; Image types (the first conversion category). Grow this list per milestone.
  !insertmacro RegFoxCNVVerb "png"
  !insertmacro RegFoxCNVVerb "jpg"
  !insertmacro RegFoxCNVVerb "jpeg"
  !insertmacro RegFoxCNVVerb "webp"
  !insertmacro RegFoxCNVVerb "gif"
  !insertmacro RegFoxCNVVerb "bmp"
  !insertmacro RegFoxCNVVerb "tiff"
  !insertmacro RegFoxCNVVerb "tif"
  ; Tell the shell the context menu changed.
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, i 0, i 0)'
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  !insertmacro UnregFoxCNVVerb "png"
  !insertmacro UnregFoxCNVVerb "jpg"
  !insertmacro UnregFoxCNVVerb "jpeg"
  !insertmacro UnregFoxCNVVerb "webp"
  !insertmacro UnregFoxCNVVerb "gif"
  !insertmacro UnregFoxCNVVerb "bmp"
  !insertmacro UnregFoxCNVVerb "tiff"
  !insertmacro UnregFoxCNVVerb "tif"
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, i 0, i 0)'
!macroend
