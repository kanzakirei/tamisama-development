@echo off
setlocal

setlocal
call SSG.exe
endlocal

set FROM="C:\Users\kanza\OneDrive\Documents\Git\tamisama-development\output"
set TO="C:\Users\kanza\OneDrive\Documents\Git\tamisama"
xcopy %FROM% %TO% /e /y

pushd %TO%
git add .
git commit -m "deploy"
git push
popd
endlocal
exit 0