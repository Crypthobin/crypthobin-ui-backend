const ENDPOINT_ERRORS = {
  // 유저 로그인
  101: 'USER_NOT_EXIST', // 입력한 ID가 존재하지 않음
  102: 'PASSWORD_INVAILD', // 입력한 비밀번호가 틀림
  103: 'INPUT_FIELD_NOT_FOUND', // ID 혹은 비밀번호를 입력하지 않음

  // 유저 회원가입
  111: 'ID_ALREADY_CLAIMED', // 이미 사용중인 아이디
  112: 'ID_TOO_SHORT_OR_LONG', // ID가 너무 김
  113: 'PASSWORD_TOO_SHORT', // 비밀번호가 너무 짧음
  114: 'INPUT_FIELD_NOT_FOUND', // ID 혹은 비밀번호를 입력하지 않음
  115: 'PASSWORD_CHECK_FAILD', // 비밀번호와 비밀번호 확인이 일치하지 않음

  901: 'USER_NOT_LOGINED_OR_TOKEN_INVAILD', // 로그인 하지 않았거나 세션이 유효하지 않음 (-> 다시 로그인)
  902: 'ENDPOINT_NOT_FOUND' // 해당하는 엔드포인트를 찾을 수 없음
}

export default ENDPOINT_ERRORS
