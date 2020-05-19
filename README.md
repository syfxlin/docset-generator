# docset-generator

> Dash 文档生成器

## 制作方式

### 1. 镜像站点

镜像工具有很多，不过我只推荐使用 [HTTrack](http://www.httrack.com/)

支持的平台：OS X / Windows/Linux/Unix/BSD

镜像站点的时候要注意排除无关的资源和链接，比如 Vue 的文档导向了 Github 仓库，我们就需要将其排除。

另外由于镜像站点会给对应的站点带去不必要的负担，所以还是建议限制下镜像的速度。

**如果官方已经提供了离线的文档那么就可以直接使用，不需要再镜像站点。**

HTML 的文档和 CHM 的文档都可以制作成 Dash 文档，CHM 文档解包后可以得到 HTML 文档，但是需要注意将文件编码转换成 UTF-8。

### 2. 放入指定的路径

依次将资源重命名并放入 `docs` 和 `icons` 目录

### 3. 编写生成的配置文件

在 `config` 文件夹创建对应名称的 `js` 文件。本工具已经将 Dash 文档制作的过程简化了，您只需要编写生成 **目录索引** 和 **过滤器** 的代码。

#### 参数

`insertToDb` 会将目录插入到 Dash 文档的 SQLite 数据库中，使用 Dash 开启文档的时候会在侧栏显示索引。

`addDashAnchor` 是添加对应 Dash 锚点的函数

`$` 是解析 HTML 后的 Document，具体使用方法查阅 `cheerio`

`docset` 是用户传入的配置，对应 config 的 export

`relativePath` 是相对路径

#### 钩子

执行顺序从上到下：

`beforeParse({ path, html })` 在解析 HTML 之前执行，需要返回 HTML

`beforeGenerateToc({ $, relativePath, addDashAnchor, docset })` 在生成目录之前执行

`generateToc({ $, relativePath, addDashAnchor, docset, insertToDb })` 生成目录，只有该方法可以插入到数据库

`beforeFilter({ $, relativePath, addDashAnchor, docset })` 前置过滤器

`filter({ $, relativePath, addDashAnchor, docset })` 过滤器

`afterFilter({ $, relativePath, addDashAnchor, docset })` 后置过滤器

`beforeWrite({ path, html })` 在 HTML 写入到文件之前执行，需要返回 HTML

具体请自行查看样例进行编写。
