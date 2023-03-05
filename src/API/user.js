import GUN from 'gun';
import 'gun/sea';
import 'gun/lib/unset';
//import 'gun/axe';

export const db = GUN([ 'http://localhost:8765/gun' ]);

export const user = db.user().recall({ sessionStorage: true });
