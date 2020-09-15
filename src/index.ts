import { IApi } from 'umi';
import { join, dirname, basename, extname } from 'path';
import getModels from './utils/getModels';
import { TPL_INDEX, TPL_ROOT, TPL_RUNTIME } from './templates';

const DIR = 'mobx-store';

export default (api: IApi): void => {
  const {
    utils: { Mustache, winPath, lodash },
    paths: { absTmpPath = '', absSrcPath = '', absPagesPath = '' },
  } = api;

  function getModelDir(): string {
    return api.config.singular ? 'model' : 'models';
  }

  function getSrcModelsPath(): string {
    return join(absSrcPath, getModelDir());
  }

  function getAllModels(): string[] {
    const srcModelsPath = getSrcModelsPath();
    const baseOpts = {
      extraModels: api.config.dva?.extraModels,
      skipModelValidate: api.config.dva?.skipModelValidate,
    };
    return lodash.uniq([
      ...getModels({
        base: srcModelsPath,
        ...baseOpts,
      }),
      ...getModels({
        base: absPagesPath,
        pattern: `**/${getModelDir()}/**/*.{ts,tsx,js,jsx}`,
        ...baseOpts,
      }),
      ...getModels({
        base: absPagesPath,
        pattern: `**/model.{ts,tsx,js,jsx}`,
        ...baseOpts,
      }),
    ]);
  }

  api.describe({
    key: 'mobx',
    config: {
      schema(joi) {
        return joi.object({
          extraModels: joi.array().items(joi.string()),
          skipModelValidate: joi.boolean(),
        });
      },
    },
  });

  api.addProjectFirstLibraries(() => [
    {
      name: 'mobx',
      path: winPath(dirname(require.resolve('mobx/package.json'))),
    },
    {
      name: 'mobx-react',
      path: winPath(dirname(require.resolve('mobx-react/package.json'))),
    },
  ]);

  api.addRuntimePlugin(() => [join(absTmpPath, DIR, 'runtime.ts')]);

  api.onGenerateFiles(() => {
    const models = getAllModels();
    const imports: string[] = [];
    const instance: string[] = [];
    const store: string[] = [];
    models.forEach((path) => {
      const importDefaultSpecifier = basename(path, extname(path));
      imports.push(`import ${importDefaultSpecifier} from '${path}';`);
      instance.push(`  ${importDefaultSpecifier}: Instance<typeof ${importDefaultSpecifier}>,`);
      store.push(`  ${importDefaultSpecifier},`);
    });
    api.writeTmpFile({
      path: `${DIR}/root.ts`,
      content: Mustache.render(TPL_ROOT, {
        imports: imports.join('\n'),
        store: store.join('\n'),
        instance: instance.join('\n'),
      }),
    });
    api.writeTmpFile({
      path: `${DIR}/index.ts`,
      content: TPL_INDEX,
    });
    api.writeTmpFile({
      path: `${DIR}/runtime.ts`,
      content: TPL_RUNTIME,
    });
  });

  api.addUmiExports(() => [
    { exportAll: true, source: `../${DIR}` },
    { specifiers: ['observer', 'inject'], source: 'mobx-react' },
  ]);
};
