/*authSlice.ts*/
export interface LOGIN_USER {
  id: number;
  username: string;
}
export interface FILE extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
export interface PROFILE {
  id: number;
  user_profile: number;
  img: string | null;
}
export interface POST_PROFILE {
  id: number;
  img: File | null;
}
export interface CRED {
  username: string;
  password: string;
}
//トークン
export interface JWT {
  refresh: string;
  access: string;
}
export interface USER {
  id: number;
  username: string;
}
export interface AUTH_STATE {
  isLoginView: boolean;
  loginUser: LOGIN_USER;
  profiles: PROFILE[];
}
/*taskSlice.ts*/
//Get restapiのシリアライザーの内容と一致する
export interface READ_TASK {
  id: number;
  task: string;
  description: string;
  criteria: string;
  status: string;
  status_name: string;
  category: number;
  category_item: string;
  estimate: number;
  responsible: number;
  responsible_username: string;
  owner: number;
  owner_username: string;
  created_at: string;
  updated_at: string;
}
//PostするときにはReadonlyのフィールドは省いている
export interface POST_TASK {
  id: number;
  task: string;
  description: string;
  criteria: string;
  status: string;
  category: number;
  estimate: number;
  responsible: number;
}
export interface CATEGORY {
  id: number;
  item: string;
}
//Reduxで管理するために利用
export interface TASK_STATE {
  tasks: READ_TASK[];
  editedTask: POST_TASK;
  selectedTask: READ_TASK;
  users: USER[];
  category: CATEGORY[];
}
/*TaskList.tsx*/
//ソートの状態を管理するステート
export interface SORT_STATE {
  rows: READ_TASK[];
  order: "desc" | "asc";
  activeKey: string; //ラベルの名前
}
