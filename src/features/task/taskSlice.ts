import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios"; //RestAPIを呼ぶのに利用
import { READ_TASK, POST_TASK, TASK_STATE, USER, CATEGORY } from "../types";

//非同期関数
//タスクの一覧を取得する
export const fetchAsyncGetTasks = createAsyncThunk("task/getTask", async () => {
  const res = await axios.get<READ_TASK[]>(
    `${process.env.REACT_APP_API_URL}/api/tasks/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  );
  return res.data;
});

//ユーザーの一覧を取得する
export const fetchAsyncGetUsers = createAsyncThunk(
  "task/getUsers",
  async () => {
    const res = await axios.get<USER[]>(
      `${process.env.REACT_APP_API_URL}/api/users/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

//カテゴリーの一覧を取得する
export const fetchAsyncGetCategory = createAsyncThunk(
  "task/getCategory",
  async () => {
    const res = await axios.get<CATEGORY[]>(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

//カテゴリーを新規作成する
export const fetchAsyncCreateCategory = createAsyncThunk(
  "task/createCategory",
  async (item: string) => {
    const res = await axios.post<CATEGORY>(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      { item: item },
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

//タスクを新規作成する
export const fetchAsyncCreateTask = createAsyncThunk(
  "task/createTask",
  async (task: POST_TASK) => {
    const res = await axios.post<READ_TASK>(
      `${process.env.REACT_APP_API_URL}/api/tasks/`,
      task,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

//タスクを更新する
export const fetchAsyncUpdateTask = createAsyncThunk(
  "task/updateTask",
  async (task: POST_TASK) => {
    const res = await axios.put<READ_TASK>(
      `${process.env.REACT_APP_API_URL}/api/tasks/${task.id}/`, //更新したいタスクのIdをURLの末尾につける
      task,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

//タスクを削除する
export const fetchAsyncDeleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id: number) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  }
);

export const initialState: TASK_STATE = {
  tasks: [
    //配列の形で定義して一つだけ初期データを入れておく
    //数値は０、文字はから文字を入れる
    {
      id: 0,
      task: "",
      description: "",
      criteria: "",
      owner: 0,
      owner_username: "",
      responsible: 0,
      responsible_username: "",
      estimate: 0,
      category: 0,
      category_item: "",
      status: "",
      status_name: "",
      created_at: "",
      updated_at: "",
    },
  ],
  editedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    responsible: 0,
    estimate: 0,
    category: 0,
    status: "",
  },
  selectedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    owner: 0,
    owner_username: "",
    responsible: 0,
    responsible_username: "",
    estimate: 0,
    category: 0,
    category_item: "",
    status: "",
    status_name: "",
    created_at: "",
    updated_at: "",
  },
  users: [
    {
      id: 0,
      username: "",
    },
  ],
  category: [
    {
      id: 0,
      item: "",
    },
  ],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    //editedTaskを更新するための処理
    editTask(state, action: PayloadAction<POST_TASK>) {
      state.editedTask = action.payload;
    },
    selectTask(state, action: PayloadAction<READ_TASK>) {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAsyncGetTasks.fulfilled,
      //タスク取得成功した場合はReduxのstateのtasksにpayload(READ_TASK[])を渡す
      (state, action: PayloadAction<READ_TASK[]>) => {
        return {
          ...state,
          tasks: action.payload,
        };
      }
    );
    builder.addCase(fetchAsyncGetTasks.rejected, () => {
      //タスクの取得に失敗した場合はルートページに飛ばす（ログイン画面）
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncGetUsers.fulfilled,
      //ユーザーの取得に成功した場合はstateのusersにpayload(USER[])を渡す
      (state, action: PayloadAction<USER[]>) => {
        return {
          ...state,
          users: action.payload,
        };
      }
    );
    builder.addCase(
      fetchAsyncGetCategory.fulfilled,
      //カテゴリーの取得に成功した場合はstateのcategoryにpayload(CATEGORY[])を渡す
      (state, action: PayloadAction<CATEGORY[]>) => {
        return {
          ...state,
          category: action.payload,
        };
      }
    );
    builder.addCase(
      fetchAsyncCreateCategory.fulfilled,
      //カテゴリーの取得に成功した場合はstateのcategory(配列)をスプレッドで展開しその末尾にpayload(CATEGORY)を追加する
      (state, action: PayloadAction<CATEGORY>) => {
        return {
          ...state,
          category: [...state.category, action.payload], //スプレッドでcategory配列の末尾にpayload(category)を追加している
        };
      }
    );
    builder.addCase(fetchAsyncCreateCategory.rejected, () => {
      //カテゴリの作成に失敗した場合はルートページに飛ばす（ログイン画面）
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncCreateTask.fulfilled,
      //タスク作成が成功した場合stateのtasks(配列)をスプレッドで展開しその先頭にpayload(READ_TASK)を追加する
      (state, action: PayloadAction<READ_TASK>) => {
        return {
          ...state,
          tasks: [action.payload, ...state.tasks],
          editedTask: initialState.editedTask, //編集中のタスクのstateを変更する
        };
      }
    );
    builder.addCase(fetchAsyncCreateTask.rejected, () => {
      //タスクの作成に失敗した場合はルートページに飛ばす（ログイン画面）
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncUpdateTask.fulfilled,
      //タスク更新が成功した場合stateのtasks(配列)をスプレッドで展開しその先頭にpayload(READ_TASK)を追加する
      (state, action: PayloadAction<READ_TASK>) => {
        return {
          ...state,
          tasks: state.tasks.map((t) =>
            t.id === action.payload.id ? action.payload : t
          ),
          editedTask: initialState.editedTask, //編集中のタスクのstateを変更する
          selectedTask: initialState.selectedTask, //選択中のタスクのstateを変更する
        };
      }
    );
    builder.addCase(fetchAsyncUpdateTask.rejected, () => {
      //タスクの更新に失敗した場合はルートページに飛ばす（ログイン画面）
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncDeleteTask.fulfilled,
      //タスク削除が成功した場合stateのtasks(配列)から削除したタスクを省いてstateに登録している
      (state, action: PayloadAction<number>) => {
        return {
          ...state,
          tasks: state.tasks.filter((t) => t.id !== action.payload), //削除したIDのタスクを省いた配列を作成登録している
          editedTask: initialState.editedTask, //編集中のタスクのstateを変更する
          selectedTask: initialState.selectedTask, //選択中のタスクのstateを変更する
        };
      }
    );
    builder.addCase(fetchAsyncDeleteTask.rejected, () => {
      //タスクの削除に失敗した場合はルートページに飛ばす（ログイン画面）
      window.location.href = "/";
    });
  },
});

export const { editTask, selectTask } = taskSlice.actions;
export const selectSelectedTask = (state: RootState) => state.task.selectedTask;
export const selectEditedTask = (state: RootState) => state.task.editedTask;
export const selectTasks = (state: RootState) => state.task.tasks;
export const selectUsers = (state: RootState) => state.task.users;
export const selectCategory = (state: RootState) => state.task.category;
export default taskSlice.reducer;
