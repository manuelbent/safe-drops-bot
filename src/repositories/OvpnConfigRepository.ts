import OvpnConfig from '../models/OvpnConfig'
import BaseRepository from './BaseRepository'

/**
 * @class OvpnConfigRepository
 */
class OvpnConfigRepository extends BaseRepository<OvpnConfig> {}

export default new OvpnConfigRepository(OvpnConfig)
