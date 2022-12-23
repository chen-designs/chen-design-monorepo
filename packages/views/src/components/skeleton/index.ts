import { expose } from '../../utils/config'
import Skeleton from './skeleton'
import SkeletonItem from './skeleton-item'
import SkeletonLine from './skeleton-line'

export default expose(Skeleton, SkeletonItem, SkeletonLine)

export { Skeleton, SkeletonItem, SkeletonLine }

export type SkeletonInstance = InstanceType<typeof Skeleton>
export type SkeletonItemInstance = InstanceType<typeof SkeletonItem>
export type SkeletonLineInstance = InstanceType<typeof SkeletonLine>
