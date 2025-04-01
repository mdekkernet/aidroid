declare module 'yaml-include' {
  const yamlInclude: {
    setBaseFile: (path: string) => void;
    YAML_INCLUDE_SCHEMA: any;
    basefile: string;
  };
  export default yamlInclude;
}
