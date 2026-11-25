@echo off
chcp 65001 > nul

rem ▼ 変換したいフォルダのパスを指定してください
set "TARGET_DIR=src\img"

for /r "%TARGET_DIR%" %%f in (*.png) do (
    echo 変換中: "%%f"
    ffmpeg -loglevel error -y -i "%%f" -lossless 1 "%%~dpnf.webp"
)

echo.
echo すべての変換が完了しました。
pause
