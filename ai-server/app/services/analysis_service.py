from app.schemas.analysis import AnalysisRequest, AnalysisResponse  # 분석 요청과 응답 데이터 모양을 가져온다.


def _format_main_exercise_name(request: AnalysisRequest) -> str:  # 현재 게시글에서 대표 운동 이름을 뽑는다.
    if not request.currentPost.exercises:
        return "운동"

    return request.currentPost.exercises[0].exerciseName


def _format_sets(request: AnalysisRequest) -> str:  # 첫 번째 운동의 세트 반복 수를 8/8/7 같은 문자열로 만든다.
    if not request.currentPost.exercises:
        return "기록 없음"

    first_exercise = request.currentPost.exercises[0]  # 분석 문장에 사용할 첫 번째 운동을 고른다.
    reps = [str(set_record.reps) for set_record in first_exercise.sets]  # 각 세트의 반복 수만 문자열로 뽑는다.

    return "/".join(reps)  # 8, 8, 7을 8/8/7 모양으로 합친다.


def make_demo_analysis(request: AnalysisRequest) -> AnalysisResponse:  # GPT 연결 전, 임시 AI 분석 결과를 만든다.
    exercise_name = _format_main_exercise_name(request)  # 분석 문장에 넣을 대표 운동 이름이다.
    current_sets = _format_sets(request)  # 분석 문장에 넣을 현재 세트 기록이다.
    previous_count = len(request.previousPosts)  # 비교에 사용된 이전 기록 개수다.

    summary = f"{request.currentPost.title} 기록입니다. {exercise_name} 세트 기록은 {current_sets}회입니다."  # 화면에 보여줄 짧은 요약이다.

    if previous_count == 0:
        recommendation = "아직 비교할 이전 기록이 부족합니다. 오늘 기록을 기준점으로 저장해두고 다음 운동 때 같은 조건으로 한 번 더 기록해보세요."  # 이전 기록이 없을 때의 추천이다.
        next_goal = f"다음 운동에서는 {exercise_name}의 목표 반복 수를 안정적으로 채우는 것을 우선하세요."  # 이전 기록이 없을 때의 다음 목표다.
    else:
        recommendation = "이전 기록이 있으므로 현재 기록과 비교할 수 있습니다. 오늘은 무게를 급하게 올리기보다 목표 반복 수를 먼저 채우는 방향이 좋습니다."  # 이전 기록이 있을 때의 추천이다.
        next_goal = f"다음 운동에서는 {exercise_name}를 같은 무게로 진행하면서 마지막 세트 반복 수를 1회 늘리는 것을 목표로 해보세요."  # 이전 기록이 있을 때의 다음 목표다.

    return AnalysisResponse(
        summary=summary,  # 요약 결과를 응답에 담는다.
        recommendation=recommendation,  # 추천 결과를 응답에 담는다.
        nextGoal=next_goal,  # 다음 목표를 응답에 담는다.
        referencedPostCount=previous_count,  # 참고한 이전 기록 개수를 응답에 담는다.
    )