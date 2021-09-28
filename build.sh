#bash build.sh
#!/bin/sh
printf '===========================\n'
printf 'Rhea-front Build Start\n'
printf '===========================\n'
npm install
npm run build
printf '===========================\n'
printf 'Rhea-front Build End\n'
printf '===========================\n'


printf '===========================\n'
printf 'Rhea-front Copy /dist(rhea_dist) -> rheapjt-rheaspringboot push Start\n'
printf '(static/src/main/resources/static/vue)\n'
printf '===========================\n'

# dist gitignore 회피 및 static/view 폴더로 들어가기 위해 dist 를 view 로 copy
mv dist vue

# rheapjt-rheaspringboot clone
git clone -b develop https://kronos:elwlxjf12@vcs.digitalkds.co.kr/rheapjt/rheapjt-rheaspringboot
rm -r -f ${WORKSPACE}/rheapjt-rheaspringboot/frontoffice/src/main/resources/templates/vue
\cp -rf ${WORKSPACE}/vue/ ${WORKSPACE}/rheapjt-rheaspringboot/frontoffice/src/main/resources/templates/vue
cd rheapjt-rheaspringboot

# rheapjt-rheaspringboot remote
git remote set-url origin https://kronos:elwlxjf12@vcs.digitalkds.co.kr/rheapjt/rheapjt-rheaspringboot
git add -A
git commit -a -m "Rhea-Front jenkins Build (`date +'%Y-%m-%d %H:%M:%S'`)"
git push -u origin develop
rm -r -f ${WORKSPACE}/vue ${WORKSPACE}/rheapjt-rheaspringboot

printf '===========================\n'
printf 'Rhea-front Copy /Dist -> rheapjt-rheaspringboot push End\n'
printf '===========================\n'
