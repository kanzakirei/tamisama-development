@eshi off

set /P MESSAGE="メッセージを入力してください："
git add .
git commit -m "%MESSAGE%"
git push

pause