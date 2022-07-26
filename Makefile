DOCKER=docker
# docker编译
DOCKERBUILD=$(DOCKER) build --platform=amd64 --no-cache  --force-rm --compress --rm
# docker运行
DOCKERRUN=$(DOCKER) run 
# docker镜像保存
DOCKERSAVE=$(DOCKER) save
# docker镜像推送到远程仓库
DOCKERPUSH=$(DOCKER) push
# docker从远程仓库拉取镜像
DOCKERPULL=$(DOCKER) pull
# 导入镜像
DOCKERLOAD=$(DOCKER) load
# docker删除镜像
DOCKERRMI=$(DOCKER) rmi -f
# docker标镜像
DOCKERTAG=$(DOCKER) tag

# docker镜像名称
DOCKERIMAGE=paasport-manager
# 命名空间
NAMESPACE = $(WHOAREYOU)
ifdef WHOAREYOU
	NAMESPACE = $(WHOAREYOU)
else
	NAMESPACE = passport
endif

# 租户名称
TENANT = $(TENANT_NAME)
ifdef TENANT_NAME
    TENANT = $(TENANT_NAME)
else
    TENANT = paasport
endif

# 镜像仓库
DOCKER_REPO_HOST = $(REGISTRY_ADDRESS)
ifdef REGISTRY_ADDRESS
	DOCKER_REPO_HOST = $(REGISTRY_ADDRESS)
else
	DOCKER_REPO_HOST = dockerhub.contoso.com
endif 
DOCKER_REPO=$(DOCKER_REPO_HOST)/$(NAMESPACE)

# 版本号
VERSION=$(shell cat version)

# 基础编译镜像
BASE_IMAGE=paasport-manager:build_latest

# 代码仓库
GIT_REPO_HOST=gitee.com
DOCKER_HUB_HOST=dockerhub.contoso.com


all: help

help: ## 使用帮助
	@echo "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\033[36m\1\\033[m:\2/' | column -c2 -t -s :)"

update: ## 更新
	git submodule sync
	git submodule foreach --recursive git reset --hard 
	git submodule foreach --recursive git clean -fdx
	git submodule init
	git submodule update
	git submodule update --remote
	git submodule foreach  --recursive 'tag="$$(git config -f $$toplevel/.gitmodules submodule.$$name.tag)";[ -n $$tag ] && git reset --hard  $$tag || echo "this module has no tag"'


build: proto dockerfile version
	$(DOCKERPULL) $(DOCKER_HUB_HOST)/paasport/$(BASE_IMAGE) || true
	$(DOCKERBUILD) -t $(DOCKER_REPO)/$(DOCKERIMAGE):$(VERSION).$(TENANT) .
	$(DOCKERPUSH) $(DOCKER_REPO)/$(DOCKERIMAGE):$(VERSION).$(TENANT) || true

proto: src/services/paasport
	make -C src/services/paasport GOLANG_DISABLED=true CHASSIS_DISSABLED=true RESTFUL2GRPC_DISABLED=true GRAPHQL_DISABLED=true TYPESCRIPT_ENABLED=true build 