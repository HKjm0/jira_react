import React, { useState } from "react"; //ReactHucksのuseStateをインポート
import { makeStyles, Theme } from "@material-ui/core/styles"; //マテリアルUIのスタイル
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Fab,
  Modal,
} from "@material-ui/core"; //マテリアルUIで今回使うコントロール
import SaveIcon from "@material-ui/icons/Save"; //マテリアルUIで利用するアイコン
import AddIcon from "@material-ui/icons/Add";

import { useSelector, useDispatch } from "react-redux"; //redux

import {
  //タスク
  fetchAsyncCreateTask,
  fetchAsyncUpdateTask,
  fetchAsyncCreateCategory,
  selectUsers,
  selectEditedTask,
  selectCategory,
  editTask,
  selectTask,
} from "./taskSlice";

import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";

const useStyles = makeStyles((theme: Theme) => ({
  field: {
    margin: theme.spacing(2),
    minWidth: 240,
  },
  button: {
    margin: theme.spacing(3),
  },
  addIcon: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  saveModal: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  paper: {
    position: "absolute",
    textAlign: "center",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const TaskForm: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector(selectUsers);
  const category = useSelector(selectCategory);
  const editedTask = useSelector(selectEditedTask);

  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [inputText, setInputText] = useState("");

  const handleOpen = () => {
    //モーダルがOpenされている
    setOpen(true);
  };
  const handleClose = () => {
    //モーダルがCloseされている
    setOpen(false);
  };

  const isDisabled = //saveボタンを有効にする時の判定
    editedTask.task.length === 0 ||
    editedTask.description.length === 0 ||
    editedTask.criteria.length === 0;

  const isCatDisabled = inputText.length === 0;

  //ユーザが入力画面でテキストを入力した時に呼ぶ関数
  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = e.target.value;
    const name = e.target.name;
    if (name === "estimate") {
      value = Number(value);
    }
    dispatch(editTask({ ...editedTask, [name]: value })); //editedTaskステートの情報を[name]: valueを元に書き換え
  };

  //responsibleが変更されたときに呼び出される関数
  const handleSelectRespChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as number; //valueを型付する
    dispatch(editTask({ ...editedTask, responsible: value }));
  };

  //statusが変更されたときに呼び出される関数
  const handleSelectStatusChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = e.target.value as string; //valueを型付する
    dispatch(editTask({ ...editedTask, status: value }));
  };

  //categoryが変更されたときに呼び出される関数
  const handleSelectCatChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as number; //valueを型付する
    dispatch(editTask({ ...editedTask, category: value }));
  };

  //ユーザー一覧
  let userOptions = users.map((
    user //reduxのstateから読んできている
  ) => (
    <MenuItem key={user.id} value={user.id}>
      {user.username}
    </MenuItem>
  ));

  //ユーザー一覧
  let catOptions = category.map((
    cat //reduxのstateから読んできている
  ) => (
    <MenuItem key={cat.id} value={cat.id}>
      {cat.item}
    </MenuItem>
  ));

  return (
    <div>
      <h2>
        {
          editedTask.id
            ? "Update Task"
            : "New Task" /*idに有効なUUIDが入っている場合は更新それ以外は新規*/
        }
      </h2>
      <form>
        <TextField
          className={classes.field}
          label="Estimate [days]"
          type="number" //番号入力
          name="estimate"
          InputProps={{ inputProps: { min: 0, max: 1000 } }}
          InputLabelProps={{
            shrink: true,
          }}
          value={editedTask.estimate}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="Task"
          type="text" //テキスト入力
          name="task"
          value={editedTask.task}
          onChange={handleInputChange}
        />
        <br />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="Description"
          type="text" //テキスト入力
          name="description"
          value={editedTask.description}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="Criteria"
          type="text" //テキスト入力
          name="criteria"
          value={editedTask.criteria}
          onChange={handleInputChange}
        />
        <br />
        <FormControl className={classes.field}>
          <InputLabel>Responsible</InputLabel>
          <Select //コンボボックスみたいなやつ
            name="responsible"
            onChange={handleSelectRespChange}
            value={editedTask.responsible}
          >
            {userOptions}
          </Select>
        </FormControl>
        <FormControl className={classes.field}>
          <InputLabel>Status</InputLabel>
          <Select //コンボボックスみたいなやつ
            name="status"
            value={editedTask.status}
            onChange={handleSelectStatusChange}
          >
            <MenuItem value={1}>Not started</MenuItem>
            <MenuItem value={2}>On going</MenuItem>
            <MenuItem value={3}>Done</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl className={classes.field}>
          <InputLabel>Category</InputLabel>
          <Select //コンボボックスみたいなやつ
            name="Category"
            value={editedTask.category}
            onChange={handleSelectCatChange}
          >
            {catOptions}
          </Select>
        </FormControl>
        <Fab //カテゴリ追加ボタン
          size="small"
          color="primary"
          onClick={handleOpen}
          className={classes.addIcon}
        >
          <AddIcon />
        </Fab>
        <Modal
          open={open}
          onClose={
            handleClose
          } /*openがTrueのときにモーダルが開きモーダル以外のところをクリックするとonClose
        に定義した関数が走る*/
        >
          <div style={modalStyle} className={classes.paper}>
            <TextField
              className={classes.field}
              InputLabelProps={{
                shrink: true,
              }}
              label="New category"
              type="text"
              value={inputText}
              onChange={handleInputTextChange}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.saveModal}
              startIcon={<SaveIcon />}
              disabled={isCatDisabled}
              onClick={() => {
                dispatch(fetchAsyncCreateCategory(inputText)); //タスクの非同期回数でカテゴリが新規登録される
                handleClose(); //モーダルを閉じるためにhandleCloseを読んでStateを変更している
              }}
            >
              SAVE
            </Button>
          </div>
        </Modal>
        <br />
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          startIcon={<SaveIcon />}
          disabled={isDisabled}
          onClick={
            editedTask.id !== 0
              ? () => dispatch(fetchAsyncUpdateTask(editedTask))
              : () => dispatch(fetchAsyncCreateTask(editedTask))
          }
        >
          {editedTask.id !== 0 ? "Update" : "Save"}
        </Button>

        <Button
          variant="contained"
          color="default"
          size="small"
          onClick={() => {
            dispatch(editTask(initialState.editedTask));
            dispatch(selectTask(initialState.selectedTask));
          }}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;
