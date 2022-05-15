if [ ! -d /opt/openflixr3/node_modules ]; then
    cd /opt/openflixr3
    npm install
fi

node '/opt/openflixr3/src/index.js' $@