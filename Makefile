run_doc_dev:
	docker run -d -v $(shell pwd):/schema --name dms_documentation -p 8001:80 registry.codenetix.com/documentation/documentation:master
doc_update:
	docker exec dms_documentation ./entrypoint.sh
run_mock_dev:
	docker run -d -v $(shell pwd):/schema --name dms_mock -p 8002:80 registry.codenetix.com/documentation/mock:master
mock_update:
	docker restart dms_mock
