#!/usr/bin/env python3
"""
OpenAPI Integration Tool
Generates TypeScript types and validates API client against OpenAPI spec
"""

import yaml
import json
import sys
from pathlib import Path
from typing import Dict, List, Any

def load_openapi_spec(spec_path: str) -> Dict:
    """Load OpenAPI specification from YAML file"""
    with open(spec_path, 'r') as f:
        return yaml.safe_load(f)

def get_type_mapping(openapi_type: str, format: str = None) -> str:
    """Map OpenAPI types to TypeScript types"""
    type_map = {
        'string': 'string',
        'integer': 'number',
        'number': 'number',
        'boolean': 'boolean',
        'array': 'Array',
        'object': 'Record<string, any>',
    }
    
    if format == 'date-time':
        return 'string  // ISO 8601 datetime'
    if format == 'date':
        return 'string  // YYYY-MM-DD'
    
    return type_map.get(openapi_type, 'any')

def generate_typescript_interface(name: str, schema: Dict, depth: int = 0) -> str:
    """Generate TypeScript interface from OpenAPI schema"""
    indent = '  ' * depth
    lines = [f'{indent}export interface {name} {{']
    
    if 'properties' in schema:
        for prop_name, prop_schema in schema['properties'].items():
            required = prop_name in schema.get('required', [])
            optional = '' if required else '?'
            
            # Get description if available
            description = prop_schema.get('description', '')
            if description:
                lines.append(f'{indent}  /** {description} */')
            
            # Handle type
            prop_type = prop_schema.get('type', 'any')
            if prop_type == 'array':
                item_type = get_type_mapping(prop_schema.get('items', {}).get('type', 'any'))
                ts_type = f'{item_type}[]'
            elif isinstance(prop_type, list):
                # Handle union types like [integer, "null"]
                ts_type = ' | '.join([get_type_mapping(t) if t != 'null' else 'null' for t in prop_type])
            else:
                ts_type = get_type_mapping(prop_type, prop_schema.get('format'))
            
            lines.append(f'{indent}  {prop_name}{optional}: {ts_type};')
    
    lines.append(f'{indent}}}')
    return '\n'.join(lines)

def extract_endpoints(spec: Dict) -> List[Dict]:
    """Extract all endpoints from OpenAPI spec"""
    endpoints = []
    
    for path, path_item in spec.get('paths', {}).items():
        for method, operation in path_item.items():
            if method.upper() in ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']:
                endpoints.append({
                    'path': path,
                    'method': method.upper(),
                    'operation_id': operation.get('operationId', ''),
                    'summary': operation.get('summary', ''),
                    'description': operation.get('description', ''),
                    'parameters': operation.get('parameters', []),
                    'request_body': operation.get('requestBody'),
                    'responses': operation.get('responses', {}),
                    'tags': operation.get('tags', []),
                })
    
    return endpoints

def generate_typescript_types(spec: Dict, output_path: str):
    """Generate TypeScript type definitions file"""
    lines = [
        '/**',
        ' * Auto-generated TypeScript types from OpenAPI specification',
        ' * Ball Don\'t Lie Lab API',
        ' * DO NOT EDIT MANUALLY',
        ' */',
        '',
        '// ===== Common Types =====',
        ''
    ]
    
    # Generate interfaces for schemas
    schemas = spec.get('components', {}).get('schemas', {})
    for schema_name, schema_def in schemas.items():
        if schema_def.get('type') == 'object':
            lines.append(generate_typescript_interface(schema_name, schema_def))
            lines.append('')
    
    # Generate API client interface
    lines.extend([
        '// ===== API Response Types =====',
        '',
        'export interface ApiResponse<T = any> {',
        '  data: T;',
        '  meta?: CursorPagination | OffsetPagination;',
        '}',
        '',
        'export interface ApiError {',
        '  error: string;',
        '  status?: number;',
        '}',
        '',
        '// ===== Enums =====',
        '',
        'export enum Sport {',
        '  NBA = "nba",',
        '  NFL = "nfl",',
        '  NHL = "nhl",',
        '  MLB = "mlb",',
        '}',
        '',
        'export enum BetType {',
        '  SPREAD = "spread",',
        '  MONEYLINE = "moneyline",',
        '  OVER_UNDER = "over_under",',
        '}',
        '',
        'export enum ModelMode {',
        '  SIMPLE = "simple",',
        '  WEIGHTED = "weighted",',
        '}',
        '',
    ])
    
    # Write to file
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_file.write_text('\n'.join(lines))
    
    print(f"✅ Generated TypeScript types: {output_path}")

def generate_api_reference(spec: Dict, output_path: str):
    """Generate API reference documentation in Markdown"""
    lines = [
        '# Ball Don\'t Lie Lab API Reference',
        '',
        f'**Version:** {spec["info"]["version"]}',
        f'**Base URL:** {spec["servers"][0]["url"]}',
        '',
        '## Table of Contents',
        ''
    ]
    
    # Group endpoints by tag
    endpoints = extract_endpoints(spec)
    endpoints_by_tag = {}
    for endpoint in endpoints:
        tags = endpoint['tags'] or ['Other']
        for tag in tags:
            if tag not in endpoints_by_tag:
                endpoints_by_tag[tag] = []
            endpoints_by_tag[tag].append(endpoint)
    
    # Add TOC
    for tag in sorted(endpoints_by_tag.keys()):
        lines.append(f'- [{tag}](#{tag.lower().replace(" ", "-")})')
    lines.append('')
    
    # Add endpoint details
    for tag in sorted(endpoints_by_tag.keys()):
        lines.extend([
            f'## {tag}',
            ''
        ])
        
        for endpoint in endpoints_by_tag[tag]:
            lines.extend([
                f'### {endpoint["summary"] or endpoint["operation_id"]}',
                '',
                f'**Method:** `{endpoint["method"]}`  ',
                f'**Path:** `{endpoint["path"]}`',
                ''
            ])
            
            if endpoint['description']:
                lines.extend([
                    endpoint['description'],
                    ''
                ])
            
            # Parameters
            if endpoint['parameters']:
                lines.extend(['**Parameters:**', ''])
                for param in endpoint['parameters']:
                    required = '(required)' if param.get('required') else '(optional)'
                    lines.append(f'- `{param["name"]}` {required}: {param.get("description", "")}')
                lines.append('')
            
            # Request body
            if endpoint['request_body']:
                lines.extend(['**Request Body:**', ''])
                content = endpoint['request_body'].get('content', {})
                if 'application/json' in content:
                    lines.append('```json')
                    lines.append('// See API documentation for schema')
                    lines.append('```')
                    lines.append('')
            
            lines.append('---')
            lines.append('')
    
    # Write to file
    output_file = Path(output_path)
    output_file.write_text('\n'.join(lines))
    
    print(f"✅ Generated API reference: {output_path}")

def validate_client_coverage(spec: Dict, client_path: str):
    """Validate that Python client covers all API endpoints"""
    endpoints = extract_endpoints(spec)
    
    # Read client file
    with open(client_path, 'r') as f:
        client_code = f.read()
    
    print("\n📊 API Coverage Report:")
    print("=" * 60)
    
    covered = 0
    total = len(endpoints)
    
    for endpoint in endpoints:
        # Check if endpoint is implemented (simple heuristic)
        path_simple = endpoint['path'].replace('{', '').replace('}', '')
        method_lower = endpoint['method'].lower()
        
        # Look for method definitions that might match
        is_covered = (
            f"def {method_lower}" in client_code or
            f"'{endpoint['path']}'" in client_code or
            endpoint['operation_id'] in client_code
        )
        
        status = "✅" if is_covered else "❌"
        covered += 1 if is_covered else 0
        
        print(f"{status} {endpoint['method']:6} {endpoint['path']:50} {endpoint['summary']}")
    
    print("=" * 60)
    print(f"Coverage: {covered}/{total} endpoints ({covered/total*100:.1f}%)")
    print()

def main():
    """Main integration function"""
    spec_path = Path(__file__).parent.parent / 'openapi-full.yaml'
    
    if not spec_path.exists():
        print(f"❌ OpenAPI spec not found: {spec_path}")
        sys.exit(1)
    
    print("🔄 Loading OpenAPI specification...")
    spec = load_openapi_spec(str(spec_path))
    
    print(f"✅ Loaded OpenAPI spec v{spec['info']['version']}")
    print()
    
    # Generate TypeScript types
    print("🔄 Generating TypeScript types...")
    ts_output = Path(__file__).parent.parent / 'frontend' / 'src' / 'types' / 'api.ts'
    generate_typescript_types(spec, str(ts_output))
    print()
    
    # Generate API reference
    print("🔄 Generating API reference...")
    docs_output = Path(__file__).parent.parent / 'API_REFERENCE.md'
    generate_api_reference(spec, str(docs_output))
    print()
    
    # Validate client coverage
    print("🔄 Validating API client coverage...")
    client_path = Path(__file__).parent / 'bdl_client.py'
    if client_path.exists():
        validate_client_coverage(spec, str(client_path))
    else:
        print(f"⚠️  Client file not found: {client_path}")
    
    print("✨ OpenAPI integration complete!")

if __name__ == '__main__':
    main()
