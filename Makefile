submodules:
	git submodule init
	git submodule update --recursive --remote

update-version: do-update-image-version commit-ver docker-image

do-update-image-version:
	./update-image-version.sh

commit-ver:
	git commit -a -m "$(shell awk '/^from/ { print $$2 }' Dockerfile)"
	git push

pkg:
	tar --exclude=eva*.js --exclude=apps czf ./deploy/farm-demo-ui.evapkg setup.py ui

docker-image:
	jks build eva-demo-farm
