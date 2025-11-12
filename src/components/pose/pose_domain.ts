import { Point } from '../point/point_domain';
import { Quaternion } from '../quaternion/quaternion_domain';

export interface Pose {
  position: Point;
  orientation: Quaternion;
}

