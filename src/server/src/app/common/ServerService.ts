import {ServerStore} from '@server/app/common/ServerStore';
import {ServerRepository} from '@server/app/common/ServerRepository';
import {OkPacket} from '@server/app/common/OkPacket';

export class ServerService<M, X, R extends ServerRepository> {
    public repository: R;
    public modelExtended: any;

    constructor(private modelClass: new (source, extra) => M,
                private modelExtendedClass: new () => X,
                private repositoryClass: new (store) => R,
                protected store: ServerStore) {
        this.modelExtended = new modelExtendedClass();
        this.repository = new this.repositoryClass(store);
    }

    createInstance(source: Partial<M>, extra?: any): M {
        return new this.modelClass(source, extra);
    }

    injectModelInCollection(input) {
        let output = [];
        input.forEach(item => {
            let modelInstance = this.createInstance(item);
            output.push(modelInstance);
        });
        return output;
    }

    getAll(): Promise<Array<M>> {
        return this.repository.getAll().then((data: Array<any>) => this.injectModelInCollection(data));
    }

    getOne(id): Promise<any> {
        return this.repository.getOne(id).then((data: any) => {
            console.log('get one response', data);
            if (data && data.length === 1) return this.createInstance(data[0]);
            else throw new Error('No item retrieved for id ' + id + ' for model ' + this.modelClass.name);
        });
    }

    new(source): M {
        return this.createInstance(source);
    }

    createPromiseResponse(response) {
        return new Promise<any>((resolve) => {
            resolve(response);
        });
    }

    itemValidation(item): { status: boolean; errors?: any, message?: string } {
        let validator = new this.modelExtended.validator();
        if (validator.pass(item, this.modelExtended.relations)) return {status: true, errors: null};
        else return {status: false, errors: validator.errors, message: 'Item validation failed!'};
    }

    create(item): Promise<M> {
        if (!item) throw new Error('No item provided for service.create!');
        let validated = this.itemValidation(item);
        if (!validated.status) throw validated.errors;
        return this.repository.create(item)
            .then((response: OkPacket) => {
                console.log("create response", response);
                if (response.insertId) return this.getOne(response.insertId);
                else throw new Error('Create error!');
            })
            .catch(error => {
                throw error;
            });
    }

    update(id, item): Promise<M> {
        if (id === undefined || id === null) throw new Error('No item provided for service.update ');
        if (!item) throw new Error('No item provided for service.update ');
        let validated = this.itemValidation(item);
        if (!validated.status) throw validated.errors;
        return this.repository.update(id, item)
            .then((response: OkPacket) => {
                if (response.affectedRows === 1) {
                    if (this.modelExtended.relations){
                        console.log(item, this.modelExtended.relations);
                    }
                    return this.getOne(id);
                } else throw new Error('Update error');
            })
            .catch(error => {
                throw error;
            });
    }

    delete(id): Promise<boolean> {
        if (!id) throw new Error('No id provided for service.delete!');
        return this.repository.delete(id)
            .then((response: OkPacket) => {
                console.log("Delete response", response);
                if (response.affectedRows === 1) return true;
                else throw new Error('Delete error!');
            })
            .catch(error => {
                throw error;
            });
    }
}
