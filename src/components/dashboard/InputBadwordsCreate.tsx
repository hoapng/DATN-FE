import React from "react";
import { Button, Col, Form, Input, Row, theme } from "antd";

const InputBadwordsCreate = (props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values: any) => {
    props.handleCreate(values.word);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      name="advanced_Create"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`word`}
            label={`Thêm từ xấu`}
          >
            <Input placeholder="placeholder" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default InputBadwordsCreate;
