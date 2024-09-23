import Release from '../models/Release'
import BaseRepository from './BaseRepository'

class ReleaseRepository extends BaseRepository<Release> {}

export default new ReleaseRepository(Release)
