const ENDPOINT_ERRORS = {
  101: 'USER_NOT_EXIST', // 입력한 ID가 존재하지 않음
  102: 'PASSWORD_INVAILD', // 입력한 비밀번호가 틀림
  103: 'INPUT_FIELD_NOT_FOUND', // ID 혹은 비밀번호를 입력하지 않음

  111: 'ID_ALREADY_CLAIMED', // 이미 사용중인 아이디
  112: 'ID_TOO_SHORT_OR_LONG', // ID가 너무 김
  113: 'PASSWORD_TOO_SHORT', // 비밀번호가 너무 짧음
  114: 'INPUT_FIELD_NOT_FOUND', // ID 혹은 비밀번호를 입력하지 않음
  115: 'PASSWORD_CHECK_FAILD', // 비밀번호와 비밀번호 확인이 일치하지 않음

  211: 'WALLET_NOT_FOUND', // 월렛을 찾을 수 없음
  212: 'WALLET_NOT_OWNER', // 월렛의 소유자가 아님

  221: 'WALLET_GENERATION_FAILD', // 월렛 생성 실패
  222: 'ADDRESS_GENERATION_FAILD', // 주소 생성 실패
  223: 'ALIAS_INVALID', // 월렛 별명이 너무 짧거나 김

  231: 'ADDRESS_INVAILD', // 주소 형식이 잘못됨
  232: 'AMOUNT_INVAILD', // 송금액 형식이 잘못됨
  233: 'WALLET_NOT_FOUND', // 월렛을 찾을 수 없음
  234: 'WALLET_NOT_OWNER', // 월렛의 소유자가 아님
  235: 'LOW_BALANCE', // 잔액 부족

  241: 'WALLET_NOT_FOUND', // 월렛을 찾을 수 없음
  242: 'WALLET_NOT_OWNER', // 월렛의 소유자가 아님

  311: 'ADDRESS_INVAILD', // 주소 형식이 잘못됨
  312: 'EXPLAIN_TOO_LONG', // 설명이 너무 김

  321: 'ADDRESS_NOT_FOUND', // 주소록을 찾을 수 없음
  322: 'ADDRESS_NOT_OWNER', // 주소록의 등록자가 아님

  331: 'ADDRESS_NOT_FOUND', // 주소록을 찾을 수 없음
  332: 'ADDRESS_NOT_OWNER', // 주소록의 등록자가 아님
  333: 'EXPLAIN_TOO_LONG', // 설명이 너무 김

  341: 'ADDRESS_NOT_FOUND', // 주소록을 찾을 수 없음
  342: 'ADDRESS_NOT_OWNER', // 주소록의 등록자가 아님

  901: 'USER_NOT_LOGINED_OR_TOKEN_INVAILD', // 로그인 하지 않았거나 세션이 유효하지 않음 (-> 다시 로그인)
  902: 'ENDPOINT_NOT_FOUND' // 해당하는 엔드포인트를 찾을 수 없음
}

export default ENDPOINT_ERRORS
