<div align="center">
    <h1>Dragverse</h1>
    <p>Decentralized livestreaming and video-sharing social media platform inspired by Tape.</p>
    <a href="https://dragverse.io">dragverse.io</a>
</div>
<br>

## Demo

https://user-images.githubusercontent.com/8083958/222954569-b88fde67-8b95-466d-aadf-e5c9542d9601.mp4

[Dragverse Video](https://dragverse.app/watch/0x70a8-0x01)  
[Youtube Video](https://youtu.be/65LG2dkBcBI)

## 📽️ About

**Dragverse** is a decentralized livestreaming and video-sharing social media platform, built using Lens Protocol and forked from the Tape project 🌿

## 💪 Community

For a place to have open discussions on features, voice your ideas, or get help with general questions please visit our community at [Discord](https://discord.gg/TbjTTgTh).

## 🚢 Deployments

| Name    | Link                                   |
| ------- | -------------------------------------- |
| Mainnet | [dragverse.app](https://dragverse.app) |

## 🔭 What's inside?

This turborepo uses [Yarn](https://classic.yarnpkg.com/) as a package manager. It includes the following packages/apps:

### Apps

| Name     | Description                              |
| -------- | -----------------------------------      |
| `web`    | NextJs dragverse website                 |
| `mobile` | React Native dragverse mobile app        |
| `embed`  | NextJs application for video embeds      |
| `api`    | NextJs serverless functions              |

### Packages

| Name        | Description                               |
| ----------- | ----------------------------------------- |
| `lens`      | Everything about Lens Backend             |
| `abis`      | Contract Interfaces                       |
| `helpers`   | Collection of browser and generic helpers |
| `ui`        | UI components                             |
| `workers`   | Cloudflare Workers                        |
| `constants` | Constants for the entire application      |
| `config`    | Shared lint config                        |

## Getting Started

Install all dependencies from repository root,

```bash
yarn install
```

Start the application,

```bash
yarn dev
```

and visit http://localhost:4783

## Deploying the application

Build all dependencies from repository root,

```bash
yarn build
```

To deploy on Vercel, use the following configuration:
<img width="917" alt="Screenshot 2023-03-01 at 11 18 04 AM" src="https://user-images.githubusercontent.com/8083958/222251470-bf9be5f8-a172-4eac-930c-d7d557880787.png">

<img width="899" alt="Screenshot 2023-03-01 at 12 55 51 PM" src="https://user-images.githubusercontent.com/8083958/222251898-e8486738-a85e-4e35-99f4-781da701468c.png">

## 🤝 Contributors

We love contributors! Dragverse uses work contributed from the Tape team. Feel free to contribute to this project but please read the [Contributing Guidelines](CONTRIBUTING.md) before opening an issue or PR so you understand the branching strategy and local development environment.

<a href="https://github.com/dragverse/marsha-v2/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=dragverse/marsha-v2" />
</a>

## 📜 License

Dragverse codebase is open-sourced software licensed under the [AGPLv3](LICENSE).
