import React from "react";
import { Button, Col, Form, Input, Row, theme } from "antd";

const InputUsersSearch = (props: any) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values: any) => {
    let query = {};
    if (values.name) {
      query = {
        ...query,
        name: `/${values.name}/i`,
      };
    }
    if (values.email) {
      query = {
        ...query,
        email: `/${values.email}/i`,
      };
    }
    if (query) {
      props.handleSearch(query);
    }
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`name`}
            label={`name`}
          >
            <Input placeholder="placeholder" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`email`}
            label={`email`}
          >
            <Input placeholder="placeholder" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              form.resetFields();
              props.setFilter("");
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default InputUsersSearch;
