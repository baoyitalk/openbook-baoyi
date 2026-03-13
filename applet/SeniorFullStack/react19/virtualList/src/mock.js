/**
 * 模拟 10000 条联系人数据
 * 每条：id、姓名、头像emoji、手机号、部门
 */

const surnames = ["张", "李", "王", "刘", "陈", "杨", "赵", "黄", "周", "吴", "徐", "孙", "马", "胡", "朱", "郭", "何", "林", "罗", "高"];
const names = ["伟", "芳", "娜", "敏", "静", "强", "磊", "洋", "勇", "艳", "杰", "军", "丽", "涛", "明", "超", "秀英", "华", "慧", "建"];
const avatars = ["😀", "😎", "🤓", "😊", "🥳", "😄", "🤗", "😺", "🐱", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐸", "🐵", "🐔", "🐧", "🐦"];
const departments = ["技术部", "产品部", "设计部", "市场部", "运营部", "财务部", "人事部", "法务部", "客服部", "销售部"];

function randomPhone() {
  const prefixes = ["138", "139", "150", "151", "186", "187", "188", "199"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let num = prefix;
  for (let i = 0; i < 8; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

// 生成 10000 条联系人
export const contacts = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: surnames[i % surnames.length] + names[Math.floor(Math.random() * names.length)] + (i < 100 ? "" : i),
  avatar: avatars[i % avatars.length],
  phone: randomPhone(),
  department: departments[i % departments.length],
}));
