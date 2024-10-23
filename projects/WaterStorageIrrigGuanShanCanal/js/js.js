newEmployee={
    key: null,//帳號+密碼
    userName: null,//用戶名
    role: role,//權限等級 1:員工 2:主管 3:人事 0:未登入
    firebaseKey:null,//firebaseKey
    ifEnable: true,//是否啟用
    basicInformation: {//人員資料表
        arrivalDate: null,//到職日
        bank: {//銀行資訊
            account: null,//銀行帳號
            branchName: null,//分行名稱
            
        },
        birthday: null,//生日
        computerExpertise: [],//電腦專長
        department: null,//進用部門
        drvingLicense: [],//駕照
        email: null,//信箱
        emergencyContact: {//緊急聯絡人資訊
            mobile: null,// 行動電話
            name: null, // 緊急聯絡人姓名
            phone: null, // 連絡電話
            relationship: null // 關係
        },
        employeeId: null,//人員編號
        homePhone: null,//連絡電話
        idCardFrontImageUrl: null, // 身分證正面照片 URL
        idCardBackImageUrl: null, // 身分證反面照片 URL
        idNumber: null,//身分證號
        languages: [],//語言能力
        mailing:{
            address: null,//通訊地址
            postalCode: null,//郵遞區號
        },//通訊地址
        maritalStatus: null,//婚姻狀況
        name: userName,//姓名
        phone: null,//行動電話
        positionTitle:null,//職稱
        professionalLicense: [],//專業證照
        profileImageUrl: null, // 大頭貼 URL
        residence:{//戶籍地址
            address: null,//通訊地址
            postalCode: null,//郵遞區號
        },
        resignationDate:null,//離職日
        schools: [//學歷
            {
                academicDegree:null,//學位
                degreeStatus:null,//畢業狀況
                name: null,//學校名稱
                department: null,//科系
                period: [null,null]//修業起訖年月
            }
        ],
        sex: null,//性別
        specialStatus: [],//特殊身分
        workExperience: [//職務經歷
            {
                company: null,//公司名稱
                position: null,//職務名稱
                salary: null,//薪資
                leavingReason: null,//離職原因
                period:[null,null]//服務起訖年月
            }
        ],
    },
    curriculumVitae: {//個人簡歷
        name: null,//姓名
        educationalQualifications: null,//學歷
        expertise: null,//專長
        professionalLicense: [],//專業證照
        workExperience: [//職務經歷
            {
                company: null,//公司名稱
                position: null,//職務名稱
                period: [null,null]//服務起訖年月
            }
        ],
        annualPublications: [//歷年著作
            {
                category: null,//類型
                date: null,//時間
                name: null//名稱
            }
        ],
        annualProjects: [//歷年計畫
            {
                sponsorUnit: null,//委託單位
                period:[null,null] ,//起訖時間
                projectName: null//計畫名稱
            }
        ],
    },
}