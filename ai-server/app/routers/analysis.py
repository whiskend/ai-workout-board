from fastapi import APIRouter  # FastAPI에서 API 주소 묶음을 만들기 위해 가져온다.
from app.schemas.analysis import AnalysisRequest, AnalysisResponse  # 분석 API의 요청/응답 모양을 가져온다.
from app.services.analysis_service import make_demo_analysis  # 실제 분석 결과를 만드는 함수를 가져온다.

router = APIRouter()  # 분석 관련 API 주소들을 이 router에 모은다.


@router.post("/demo", response_model=AnalysisResponse)  # POST /analysis/demo 요청을 받을 준비를 한다.
def analyze_demo(request: AnalysisRequest):  # NestJS가 보낸 운동 기록 분석 요청을 받는다.
    return make_demo_analysis(request)  # 임시 분석 결과를 만들어서 응답한다.