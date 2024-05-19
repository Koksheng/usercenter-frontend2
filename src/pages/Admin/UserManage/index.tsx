import { deleteUser, searchUsers, updateUser } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Image } from 'antd';
import { ReactNode, useRef, useState } from 'react';
import { message } from 'antd';
// import CurrentUser = API.CurrentUser;

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const deleteItem = async (userId: number) => {
  return await deleteUser(userId); // Pass the userId as an option to the deleteUser function
};

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'userName', // == username == normalizedUserName
    copyable: true,
  },
  {
    title: '用户账户',
    dataIndex: 'userAccount', // == userAccount
    copyable: true,
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    render: (_: ReactNode, record: API.CurrentUser) => (
      <div>
        <Image src={record.avatarUrl} width={100} />
      </div>
    ),
  },
  {
    title: '性别',
    dataIndex: 'gender',
    valueType: 'select',
    valueEnum: {
      2: { text: 'Female', status: 'Error' },
      1: {
        text: 'Male',
        status: 'Success',
      },
      0: {
        text: 'ALL',
        status: 'Default',
      },
    },
  },
  {
    title: '电话',
    dataIndex: 'phone',
    copyable: true,
  },
  {
    title: '邮件',
    dataIndex: 'email',
    copyable: true,
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    valueType: 'select',
    valueEnum: {
      2: { text: 'Inactive', status: 'Error' },
      1: {
        text: 'Active',
        status: 'Success',
      },
      0: {
        text: 'ALL',
        status: 'Default',
      },
    },
  },
  {
    title: '星球编号',
    dataIndex: 'planetCode',
  },

  {
    title: '角色',
    dataIndex: 'userRole', // userRole == isAdmin
    valueType: 'select',
    valueEnum: {
      2: { text: 'User', status: 'Warning' },
      1: {
        text: 'Admin',
        status: 'Success',
      },
      0: {
        text: 'ALL',
        status: 'Default',
      },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={async () => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      // <a href={record.avatarUrl} target="_blank" rel="noopener noreferrer" key="view">
      //   查看
      // </a>,
      // <TableDropdown
      //   key="actionGroup"
      //   onSelect={async (key) => {
      //     if (key === 'delete') {
      //       var res = await deleteItem(record.id);
      //       //@ts-ignore
      //       if(res === 1){
      //         action?.reload(); // Refresh the table
      //         message.success('delete 成功');
      //       } else {
      //         console.error('Failed to delete item');
      //       }
              
      //     } else {
      //       action?.reload();
      //     }
      //   }}
      //   menus={[
      //     { key: 'copy', name: '复制' },
      //     { key: 'delete', name: '删除' },
      //   ]}
      // />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();

  // actionRef.current? 的一些 action
  // interface ActionType {
  //   reload: (resetPageIndex?: boolean) => void;
  //   reloadAndRest: () => void;
  //   reset: () => void;
  //   clearSelected?: () => void;
  //   startEditable: (rowKey: Key) => boolean;
  //   cancelEditable: (rowKey: Key) => boolean;
  // }

  const handleEditSubmit = async (values: API.CurrentUser) => {
    try {
      // update
      var res = await updateUser({
        ...values,
      });
      message.success('update 成功');
    } catch (error: any) {
      const defaultLoginFailureMessage = 'update失败，请重试！';
      message.error(defaultLoginFailureMessage);
      // Relaod the table
      actionRef.current?.reload();
    }
  };

  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      //@ts-ignore
      request={async (params, sort, filter) => {
        console.log("params", params);
        console.log("sort", sort);
        console.log("filter", filter);
        // await waitTime(2000);

        const userList = await searchUsers({
          ...params,
          sort,
          filter,
        });
        return {
          //@ts-ignore
          // data: userList.data,
          data: userList,
        };
      }}
      editable={{
        type: 'multiple',
        // onValuesChange: handleValuesChange,
        onSave: async (rowKey, data, row) => {
          console.log("rowKey",rowKey);
          // console.log("data", data);
          // console.log("row", row);
          await handleEditSubmit(data as API.CurrentUser);
        },
        onDelete: async (rowKey, row) => {
          // console.log("rowKey",rowKey);
          // console.log("row", row);
          // console.log("row.id", row.id);
          var res = await deleteItem(row.id);
          //@ts-ignore
          if(res === 1){
            // actionRef?.reload(); // Refresh the table
            message.success('delete 成功');
          } else {
            console.error('Failed to delete item');
          }
        },
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
    />
  );
};
