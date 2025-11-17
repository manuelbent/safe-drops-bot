import { Attributes, CreationAttributes, Model, ModelStatic, WhereAttributeHashValue, Includeable } from 'sequelize'

/**
 * @class BaseRepository
 */
class BaseRepository<T extends Model> {
    private model: ModelStatic<T>

    constructor(model: ModelStatic<T>) {
        this.model = model
    }

    async create(data: CreationAttributes<T>): Promise<T> {
        return this.model.create(data)
    }

    async update(id: WhereAttributeHashValue<Attributes<T>[string]>|undefined, data: CreationAttributes<T>) {
        return this.model.update(data, { where: { id } })
    }

    async delete(id: WhereAttributeHashValue<Attributes<T>[string]>) {
        return this.model.destroy({ where: { id } })
    }

    async findById(id: WhereAttributeHashValue<Attributes<T>[string]>): Promise<T|null> {
        return this.model.findOne({ where: { id } })
    }

    async findBy(where: WhereAttributeHashValue<Attributes<T>[string]>): Promise<T[]> {
        return this.model.findAll({ where })
    }

    async findAll(include?: Includeable[]) {
        return this.model.findAll({ include })
    }
}

export default BaseRepository
