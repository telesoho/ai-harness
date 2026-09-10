# 词表（Glossary）

> 本项目使用的核心术语。中英对照，便于搜索 DSH 源码。

## Token

模型处理的最小语义单位。大致是"约 4 个英文字符"或"1 个汉字"。模型按 token 计费与限流。

## Tool / Function calling

让模型在回复中不只输出文字，还可以输出**结构化调用请求**（"调用 `read_file`，参数是 `{"path": "x.ts"}`"）。客户端执行后把结果回灌给模型。

DSH 中：
- 模型侧：`tool_calls` 字段（OpenAI/DeepSeek 协议）或 `tool_use` 块（Anthropic 协议）
- 客户端侧：`Tool` 接口 + `ToolRegistry` 注册表

## Streaming

模型响应不是一次性返回，而是**逐 token / 逐事件**流式发出。客户端用 `AsyncIterable` 消费，可以实时渲染。

## Stop reason

模型为何停止生成。常见值：
- `end_turn` —— 自然结束，可以开始下一轮
- `tool_use` —— 调用工具，需要执行后回灌
- `max_tokens` —— 触达上限，截断
- `error` —— 出错

DSH 在 `packages/core/src/stop.ts` 定义。

## Thinking / Reasoning

DeepSeek 与 Anthropic 支持"思考模式"：模型在最终答案前会有一段**不展示给用户**的推理链。DSH 中以 `thinking_delta` 事件流出。

## Prompt cache

DeepSeek 等模型支持"prompt caching"：相同前缀的请求复用已计算的 KV cache，省钱省时。DSH 通过 `cache_control` 字段控制。

## Session

一次完整的"用户 ↔ agent"对话，含所有消息、工具结果、配置快照。DSH 把会话存为 `~/.dsh/sessions/<id>.jsonl`。

## MCP

Model Context Protocol。Anthropic 提出的"工具描述标准协议"，让 agent 与外部工具服务器通信。DSH 通过 `packages/mcp` 实现。

## LSP

Language Server Protocol。代码编辑器用的"智能提示协议"。DSH 通过 `packages/lsp` 集成，让 agent 获得 IDE 级代码理解。

## Sub-agent

主 agent 把任务分给一个**独立上下文**的子 agent，避免主上下文被污染。DSH 通过 `packages/subagent` 实现。

## Workflow

多 agent 编排：用一张"图"定义多个 agent 何时被调用、如何共享状态。DSH 通过 `packages/workflow` 实现。

## Egress

出站网络请求的**白名单/黑名单**。生产 agent 必须限制能访问的域名。DSH 通过 `packages/llm/llm-pi-ai/src/egress.ts` 等多处实现。

## Boot

进程启动流程的统称：解析 CLI flag → 加载配置 → 选择 provider → 启动 session。DSH 通过 `packages/boot` 统一编排。