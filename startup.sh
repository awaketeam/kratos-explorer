export METEOR_SETTINGS="$(cat $APP_SOURCE_FOLDER/settings.json )"
cd $APP_BUNDLE_FOLDER/bundle/programs/server/ && npm install
pm2 start $APP_BUNDLE_FOLDER/bundle/main.js
sudo tail -f /var/log/nginx/access.log