# Git Switcher Util

一个命令行工具，用于轻松切换个人或工作用的不同 Git 配置。该工具允许你添加、切换、导出、更新和删除 Git 配置。

## 功能

- **添加配置**: 添加新的 Git 配置，包括键、名称和电子邮件。
- **切换配置**: 在现有 Git 配置之间切换。
- **导出配置**: 将所有配置导出到指定的目录。
- **更新配置**: 更新指定的 Git 配置。
- **删除配置**: 删除指定的 Git 配置。

## 使用方法

1. 全局安装该工具：

```bash
npm install -g gitswitcherutil
```

2.安装完成后，可以使用以下命令运行工具：

```bash
gitswitcherutil
```

### 示例

当你选择切换配置时，系统会提示你从可用配置中选择。选择后，工具将使用所选的名称和电子邮件更新你的全局 Git 配置。

## 需求

- Node.js (v18 或更高版本)
- npm

## 贡献

欢迎贡献！请随时提交拉取请求或打开问题。