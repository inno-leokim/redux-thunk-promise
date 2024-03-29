// 리덕스 모듈 리팩토링

// Promise에 기반한 Thunk를 만들어 주는 함수
export const createPromiseThunk = (type, promiseCreator) => {
    
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`]; //배열 변수를 배열로 받으면 차례대로 변수에 저장된다.

    // 이 함수는 promiseCreator가 단 하나의 파라미터만 받는다는 전제하에 작성.
    // 만약 여러 종류의 파라미터를 전달해야하는 상황에서는 객체 타입의 파라미터를 받아오도록 하면 됨.
    // 예: writeComment({ postId: 1, text: '댓글 내용' });    

    return param => async dispatch => {
        // 요청시작
        dispatch({type, param});

        try {
            // 결과물의 이름을 payload 라는 이름으로 통일
            const payload = await promiseCreator(param);
            dispatch({ type: SUCCESS, payload }); //성공
        } catch (e) {
            dispatch({ type: ERROR, payload: e, error: true}); //실패
        }
    };
};


// 리듀서에서 사용할 수 있는 여러 유틸 함수들.
export const reducerUtils = {
    // 초기 상태. 초기 data 값은 기본적으로 null 이지만
    // 변경 가능.
    initial: (initialData = null) => ({
        loading: false,
        data: initialData,
        error: null
    }),
    
    // 로딩중 상태. 
    // prevState의 경우엔 기본값은 null 이지만
    // 따로 값을 지정하면 null 로 바꾸지 않고 다른 값을 유지시킬 수 있음.
    loading: (prevState = null) => ({
        loading: true,
        data: prevState,
        error: null
    }),

    // 성공 상태 
    success: payload => ({
        loading: false,
        data: payload,
        error: null
    }),
    
    // 실패 상태
    error: error => ({
        loading: false,
        data: null,
        error
    })
};


// 비동기 관련 액션들을 처리하는 리듀서 생성
// type은 액션의 타입, key는 상태의 key (예: posts, post) 입니다.
export const handleAsyncActions = (type, key) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

    return (state, action) => {
        switch(action.type){
            case type:
                return {
                    ...state,
                    [key]: reducerUtils.loading()
                };
            case SUCCESS:
                return {
                    ...state,
                    [key]: reducerUtils.success(action.payload)
                }
            case ERROR:
                return {
                    ...state,
                    [key]: reducerUtils.error(action.payload)
                }
            default:
                return state;
        }
    }
}