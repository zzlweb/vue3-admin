import {
  Button,
  Card,
  Row,
  Col,
  Tag,
  Form,
  Input,
  ConfigProvider,
  Select,
  DatePicker,
  Dropdown,
  Menu,
  Divider,
  Badge,
  BackTop,
  Carousel,
  Layout,
  Breadcrumb,
  Tooltip,
  Table,
  Popconfirm,
  Drawer,
  Radio,
  Spin,
  Space,
  TimePicker,
  Slider,
  InputNumber,
  Checkbox
} from 'ant-design-vue'

/**
 * @description 手动注册 antd-vue 组件,达到按需加载目的
 * @description Automatically register components under Button, such as Button.Group
 * @param {ReturnType<typeof createApp>} app 整个应用的实例
 * @returns void
 */
export default function loadComponent(app) {
  app.use(Button)
  app.use(Card)
  app.use(Row)
  app.use(Col)
  app.use(Tag)
  app.use(Form)
  app.use(Input)
  app.use(Dropdown)
  app.use(Menu)
  app.use(Divider)
  app.use(ConfigProvider)
  app.use(Select)
  app.use(DatePicker)
  app.use(BackTop)
  app.use(Badge)
  app.use(Carousel)
  app.use(Layout)
  app.use(Breadcrumb)
  app.use(Tooltip)
  app.use(Table)
  app.use(Popconfirm)
  app.use(Drawer)
  app.use(Radio)
  app.use(Spin)
  app.use(Space)
  app.use(TimePicker)
  app.use(Slider)
  app.use(InputNumber)
  app.use(Checkbox)
}
