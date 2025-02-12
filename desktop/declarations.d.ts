declare module 'await-spawn' {
    import { spawn } from 'child_process';
    type SpawnParams = Parameters<spawn>;
    declare async function spawn(
        ...spawn_params: SpawnParams
    ): Promise<BufferList>;
    export = spawn;
}

declare module 'another-json' {
    declare function stringify(js: any): string;
}
