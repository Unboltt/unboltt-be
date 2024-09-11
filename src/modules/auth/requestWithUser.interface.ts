import { UserDocument } from './../user/user.schema';
import { Request } from 'express';

export default interface RequestWithUser extends Request {
  user: UserDocument;
}
