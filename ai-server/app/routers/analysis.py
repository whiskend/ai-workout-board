from typing import Optional

from fastapi import (
    APIRouter,
    Header,
)  # FastAPI에서 API 주소 묶음과 요청 헤더를 받기 위해 가져온다.
from app.routers.internal import (
    verify_internal_token,
)  # NestJS가 보낸 내부 요청 토큰이 맞는지 검사한다.
from app.schemas.analysis import (
    AnalysisRequest,
    AnalysisResponse,
)  # 분석 API의 요청/응답 모양을 가져온다.
from app.services.analysis_service import (
    make_demo_analysis,
)  # 실제 분석 결과를 만드는 함수를 가져온다.

router = APIRouter()  # 분석 관련 API 주소들을 이 router에 모은다.


@router.post(
    "/demo", response_model=AnalysisResponse
)  # POST /analysis/demo 요청을 받을 준비를 한다.
def analyze_demo(
    request: AnalysisRequest,
    x_internal_token: Optional[str] = Header(default=None),
):  # NestJS가 보낸 운동 기록 분석 요청을 받는다.
    verify_internal_token(
        x_internal_token
    )  # FastAPI를 아무나 직접 호출하지 못하도록 내부 토큰을 검사한다.
    return make_demo_analysis(request)  # 임시 분석 결과를 만들어서 응답한다.
