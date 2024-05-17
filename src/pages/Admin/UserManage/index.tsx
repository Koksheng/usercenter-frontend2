import { deleteUser, searchUsers, updateUser } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Image } from 'antd';
import { ReactNode, useRef } from 'react';
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
      false: { text: 'User', status: 'Default' },
      true: {
        text: 'Admin',
        status: 'Success',
      },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
  },

  // {
  //   disable: true,
  //   title: '状态',
  //   dataIndex: 'state',
  //   filters: true,
  //   onFilter: true,
  //   ellipsis: true,
  //   valueType: 'select',
  //   valueEnum: {
  //     all: { text: '超长'.repeat(50) },
  //     open: {
  //       text: '未解决',
  //       status: 'Error',
  //     },
  //     closed: {
  //       text: '已解决',
  //       status: 'Success',
  //       disabled: true,
  //     },
  //     processing: {
  //       text: '解决中',
  //       status: 'Processing',
  //     },
  //   },
  // },
  // {
  //   disable: true,
  //   title: '标签',
  //   dataIndex: 'labels',
  //   search: false,
  //   renderFormItem: (_, { defaultRender }) => {
  //     return defaultRender(_);
  //   },
  //   render: (_, record) => (
  //     <Space>
  //       {record.labels.map(({ name, color }) => (
  //         <Tag color={color} key={name}>
  //           {name}
  //         </Tag>
  //       ))}
  //     </Space>
  //   ),
  // },

  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.avatarUrl} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={async (key) => {
          if (key === 'delete') {
            var res = await deleteItem(record.id);
            //@ts-ignore
            if(res === 1){
              action?.reload(); // Refresh the table
            } else {
              console.error('Failed to delete item');
            }
              
          } else {
            action?.reload();
          }
        }}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();

  const handleEditSubmit = async (values: API.CurrentUser) => {
    try {
      // 注册
      var res = await updateUser({
        ...values,
        // type,
      });
      // // if (res.code===0 && res.data > 0) {
      // if (id) {
      //   const defaultLoginSuccessMessage = '注册成功！';
      //   message.success(defaultLoginSuccessMessage);
      //   const urlParams = new URL(window.location.href).searchParams;
      //   history.push(urlParams.get('redirect') || '/');
      //   // if(!history) return;
      //   // const {query} = history.location;
      //   // history.push({
      //   //   pathname: '/user/login',
      //   //   query,
      //   // });
      //   return;
      // } 
      // else {
      //   // throw new Error(res.description);
      //   throw new Error("resiter error id");
      // }
    } catch (error: any) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      // message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      //@ts-ignore
      request={async (params, sort, filter) => {
        console.log(sort, filter);
        await waitTime(2000);

        const userList = await searchUsers();
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
          console.log("data", data);
          console.log("row", row);
          await handleEditSubmit(data as API.CurrentUser);
          // onFinish={async (values) => {
          //   await handleSubmit(values as API.RegisterParams);
          // }}
          // await waitTime(2000);
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
