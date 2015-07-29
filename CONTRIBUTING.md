
# MOGL에 참여하는 방법

1. `GitHub` 계정이 있어야 합니다.
1. GitHub에서 MOGL의 repository를 `Fork`해 주세요.
1. `Fork`한 repository를 로컬에 `Clone` 받아 코드를 작성합니다.
1. 코드 작성시에는 반드시 아래의 [Guideline](#guideline)을 확인해 주세요.
1. 변경된 코드를 본인의 repository에 `Push`합니다.
1. `Pull Request`를 보내주시면 검토 후 `Merge` 됩니다.

# Guideline

* 소스 코드 작성은 항상 최신의 `dev` branch를 사용해 주세요. `master` branch는 소스 코드 작성에 사용되지 않습니다.

* `Fork`한 repository를 로컬에 `Clone` 한 후에, MoGL 디렉터리에서

	> git checkout dev
 
	를 실행하면 소스를 작성할 수 있는 `dev` branch를 checkout 할 수 있습니다.

* patch 또는 feature마다 별도의 branch를 생성해 주세요.

* `Pull Request`를 보낸 이후에는 `Fork`한 repository의 `dev` branch의 코드를 수정하지 않아야 합니다.

* 새로운 기능을 추가하셨다면 사용하는 방법과 정상 동작하는 것을 확인할 수 있는 예제 또한 추가해 주세요.

* 기존 코딩 컨벤션을 필히 숙지하고 지켜주세요.

* `Pull Request`에 빌드 파일을 추가해서는 안됩니다.

_ _ _

버그 리포트, 기능 요청, 또는 도움 및 문의는 [MOGL 페이스북 그룹](https://www.facebook.com/groups/MObilewebGL)을 이용해 주세요.
