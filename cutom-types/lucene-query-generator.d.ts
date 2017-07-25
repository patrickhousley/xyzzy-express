declare module 'lucene-query-generator' {
  namespace generator {
    interface searchOperand {
      [key: string]: any;
    }

    type searchOperator = 'AND' | 'OR' | 'NOT';
    
    interface searchTerms {
      $operands: searchOperand[] | string[],
      $operator?: searchOperator
    }

    type schemaType = 'string' | 'int' | 'long' | 'float' | 'double' | 'boolean' | 'date';

    interface searchSchema {
      [key: string]: schemaType
    }

    interface searchOptions {
      schema?: searchSchema
    }

    function convert(terms: searchTerms, options?: searchOptions): string;
  }

  export = generator;
}
