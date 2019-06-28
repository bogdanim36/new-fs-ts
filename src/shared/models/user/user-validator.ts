import {ModelValidator} from "@shared/common/model-validator";
import {User} from "@shared/models/user/user";

export class UserValidator extends ModelValidator<User> {

    constructor(item) {
        super(item);
        this.getRuleForField('email', 'required');
        this.getRuleForField('firstName', 'required');
        this.getRuleForField('lastName', 'required');
    }
}
