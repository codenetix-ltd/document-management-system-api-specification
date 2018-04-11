#!/usr/bin/env bash

rm -rf /workschema/*
cp -r /schema/* /workschema
rm -rf /workschema/examples

for d in /workschema/*.raml; do
 cat $d | grep -q '!include' && sed -i -e "s%!include%q!include%g" $d
done

for d in /workschema/*/*.raml; do
 cat $d | grep -q '!include' && sed -i -e "s%!include%q!include%g" $d
done

node unsetExample.js

for d in /workschema/*.raml; do
 cat $d | grep -q '!include' && sed -i -e "s%'q!include%!include%g" $d && sed -i -e "s%.raml'%.raml%g" $d
done

for d in /workschema/*/*.raml; do
 cat $d | grep -q '!include' && sed -i -e "s%'q!include%!include%g" $d && sed -i -e "s%.raml'%.raml%g" $d
done

for d in /workschema/*.raml; do
 cat $d | grep -q '!include' && sed -i -e "s%!include %!include $(dirname $d)/%g" $d
done

for d in /workschema/*/*.raml; do
 cat $d | grep -q '!include' && sed -i -e "s%!include %!include $(dirname $d)/%g" $d
done

exec "$@"