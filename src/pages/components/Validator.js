import { ValidatorContext } from "rainbowui-sugar-tools";

const ZipCodeRequiredValidator = {
    validate: function (component) {
        let validator = {
            notEmpty: {
                message: i18n.FieldsCannotBeEmpty
            },
            stringLength: {
                min: 0,
                max: 8,
                message: i18n.postCodeValidator
            }
        };
        ValidatorContext.putValidator(component.getValidationGroup(), component.componentId, validator);
    }
};
const MobileRequiredValidator = {
    validate: function (component) {
        let validator = {
            notEmpty: {
                message: i18n.FieldsCannotBeEmpty
            },
            stringLength: {
                min: 0,
                max: 20,
                message: i18n.MobileValidator
            }
        };
        ValidatorContext.putValidator(component.getValidationGroup(), component.componentId, validator);
    }
};

const ZipCodeValidator = {
    validate: function (component) {
        let validator = {
            // notEmpty: {
            //     message: i18n.FieldsCannotBeEmpty
            // },
            stringLength: {
                min: 0,
                max: 8,
                message: i18n.postCodeValidator
            }
        };
        ValidatorContext.putValidator(component.getValidationGroup(), component.componentId, validator);
    }
};
const MobileValidator = {
    validate: function (component) {
        let validator = {
            // notEmpty: {
            //     message: i18n.FieldsCannotBeEmpty
            // },
            stringLength: {
                min: 0,
                max: 20,
                message: i18n.MobileValidator
            }
        };
        ValidatorContext.putValidator(component.getValidationGroup(), component.componentId, validator);
    }
};

// const EmailValidator = {
//     validate(component) {
//         let validator = {
//             regexp: {
//                 regexp: /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+\.(?:com|cn)$/,
//                 message: '请输入正确的邮箱'
//             },
//         };
//         ValidatorContext.putValidator(component.getValidationGroup(), component.componentId, validator);
//     }
// };

// const PhoneValidator = {
//     validate(component) {
//         let validator = {
//             callback: {
//                 message: '请输入正确的手机号码',
//                 callback: function (value, validator) {
//                     return Validate.validateMobile(value);
//                 }
//             }
//         };
//         ValidatorContext.putValidator(component.getValidationGroup(), component.componentId, validator);
//     }
// };
//身份证
const IdNoValidator = {
    validate: function (component) {
        let validator = {
            notEmpty: {
                message: i18n.FieldsCannotBeEmpty
            },
            stringLength: {
                max: 20,
                message: i18n.IdNoValidator
            }
        };
        ValidatorContext.putValidator(component.getValidationGroup(), component.componentId, validator);
    }
};
// //证件长度
// const IdNoLengthValidator = {
//     validate(component) {
//         let validator = {
//             notEmpty: {
//                 message: "该字段必填，不能为空"
//             },
//             stringLength: {
//                 max: 20,
//                 message: i18n.IdNoMaxLen
//             }
//         };
//         ValidatorContext.putValidator(component.getValidationGroup(), component.componentId, validator);
//     }
// };
// //外国人身份证
// const ForeignIdValidator = {
//     validate(component) {
//         let validator = {
//             notEmpty: {
//                 message: "该字段必填，不能为空"
//             },
//             stringLength: {
//                 max: 20,
//                 message: '证件号码的最大长度为20。'
//             },
//             callback: {
//                 message: i18n.IDIncorrect,
//                 callback: function (value, validator) {
//                     return Validate.validForeignId(value);
//                 }
//             }
//         };
//         ValidatorContext.putValidator(component.getValidationGroup(), component.componentId, validator);
//     }
// };
// //组织机构代码
// const IdentityOrgCardNoValidator = {
//     validate(component) {
//         let validator = {
//             notEmpty: {
//                 message: "该字段必填，不能为空"
//             },
//             stringLength: {
//                 max: 20,
//                 message: '证件号码的最大长度为20。'
//             },
//             callback: {
//                 message: i18n.IDIncorrect,
//                 callback: function (value, validator) {
//                     return Validate.isIdentityOrgCardNo(value);
//                 }
//             }
//         };
//         ValidatorContext.putValidator(component.getValidationGroup(), component.componentId, validator);
//     }
// };
// //三证合一
// const IdentityOrgthreeCardNoValidator = {
//     validate(component) {
//         let validator = {
//             notEmpty: {
//                 message: "该字段必填，不能为空"
//             },
//             stringLength: {
//                 max: 20,
//                 message: '证件号码的最大长度为20。'
//             },
//             callback: {
//                 message: i18n.IDIncorrect,
//                 callback: function (value, validator) {
//                     return Validate.isIdentityOrgthreeCardNo(value);
//                 }
//             }
//         };
//         ValidatorContext.putValidator(component.getValidationGroup(), component.componentId, validator);
//     }
// };

module.exports = { MobileValidator, ZipCodeValidator, IdNoValidator, MobileRequiredValidator, ZipCodeRequiredValidator};